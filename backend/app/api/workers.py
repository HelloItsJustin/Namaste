from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import Worker, Credential, Dividend, db
from app.services.ai_service import trust_score_engine
from app.services.uplift_service import uplift_engine
from app.services.chat_service import chat_service_answer, loan_recommendation
from app.services.anomaly_service import anomaly_detector
from dataclasses import asdict

workers_bp = Blueprint('workers', __name__)

@workers_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    
    if not worker:
        return jsonify({"error": "Worker not found"}), 404
        
    # Get recent dividends
    recent_dividends = Dividend.query.filter_by(worker_id=worker.id)\
        .order_by(Dividend.created_at.desc()).limit(5).all()
        
    dividends_data = [{
        "id": d.id,
        "amount": d.amount,
        "source": d.source,
        "type": d.type,
        "tx_hash": d.tx_hash,
        "status": d.status,
        "date": d.created_at.strftime('%Y-%m-%d')
    } for d in recent_dividends]

    return jsonify({
        "worker": {
            "name": worker.name,
            "worker_id": worker.worker_id,
            "did": worker.did,
            "trust_score": worker.trust_score,
            "location": worker.location,
            "occupation": worker.occupation,
            "platform": worker.platform,
            "wallet_address": worker.wallet_address
        },
        "stats": {
            "total_dividends": sum(d.amount for d in worker.dividends if d.type == 'credit'),
            "credential_count": worker.credentials.count(),
            "vouch_count": 7 # Mock
        },
        "recent_dividends": dividends_data
    }), 200

@workers_bp.route('/credentials', methods=['GET'])
@jwt_required()
def get_credentials():
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    
    credentials = Credential.query.filter_by(worker_id=worker.id).all()
    data = [{
        "id": c.vc_id,
        "type": c.type,
        "title": c.title,
        "issuer": c.issuer,
        "issued_at": c.issued_at.strftime('%Y-%m-%d'),
        "status": c.status,
        "ipfs_hash": c.ipfs_hash,
        "onchain_hash": c.onchain_hash
    } for c in credentials]
    
    return jsonify(data), 200

@workers_bp.route('/trustscore/explanation', methods=['GET'])
@jwt_required()
def get_trustscore_explanation():
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    
    # Simulate signal collection
    signals = {
        "job_completion_rate": 0.94,
        "income_consistency": 0.88,
        "platform_tenure_months": 18,
        "payment_punctuality": 0.92,
        "vouch_count": 7,
        "eshram_status": True
    }
    
    score_details = trust_score_engine.calculate_score(signals)
    return jsonify(score_details), 200


@workers_bp.route('/uplift', methods=['GET'])
@jwt_required()
def get_uplift_plan():
    """
    Returns a personalised 90-day financial uplift plan for the authenticated worker.
    Includes top-3 recommendations, projected TrustScore, and government scheme matches.
    """
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()

    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    # Build signals from the worker's real data where available,
    # falling back to conservative defaults for fields not yet tracked.
    signals = {
        "trust_score": worker.trust_score,
        "job_completion_rate": 0.94,        # TODO: derive from platform event data
        "income_consistency": 0.88,
        "platform_tenure_months": 18,
        "payment_punctuality": 0.92,
        "vouch_count": 7,
        "eshram_status": bool(worker.eshram_id),
        "pan_linked": False,                # TODO: add pan_linked flag to Worker model
        "bank_linked": bool(worker.upi_id),
        "platform_count": 1,               # TODO: derive from credentials
        "platforms": [worker.platform] if worker.platform else [],
    }

    plan = uplift_engine.generate_plan(signals)

    return jsonify({
        "current_score": plan.current_score,
        "projected_score": plan.projected_score,
        "projected_in_days": plan.projected_in_days,
        "score_band": plan.score_band,
        "projected_band": plan.projected_band,
        "summary": plan.summary,
        "recommendations": plan.recommendations,
        "schemes": plan.schemes,
        "platform_recommendations": plan.platform_recommendations,
    }), 200


@workers_bp.route('/uplift/schemes', methods=['GET'])
@jwt_required()
def get_uplift_schemes():
    """
    Returns only the government scheme matches for the authenticated worker.
    Useful for a lightweight scheme eligibility widget.
    """
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()

    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    signals = {
        "trust_score": worker.trust_score,
        "eshram_status": bool(worker.eshram_id),
        "bank_linked": bool(worker.upi_id),
    }

    plan = uplift_engine.generate_plan(signals)
    return jsonify({"schemes": plan.schemes}), 200


@workers_bp.route('/chat', methods=['POST'])
@jwt_required()
def worker_chat():
    """
    Feature 1 — Loan Explainer & Negotiation AI (worker side).
    Accepts a natural-language question and returns an AI-generated answer
    based on the worker's trust signals.

    Body: { "question": "why is my score low?" }
    """
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()
    if not question:
        return jsonify({"error": "question is required"}), 400

    signals = {
        "score": worker.trust_score,
        "job_completion_rate": 0.94,
        "income_consistency": 0.88,
        "vouch_count": 7,
        "eshram_status": bool(worker.eshram_id),
        "bank_linked": bool(worker.upi_id),
        "total_dividends": sum(d.amount for d in worker.dividends if d.type == "credit"),
        "worker_id": worker.worker_id,
        "name": worker.name,
    }

    answer = chat_service_answer(question, signals)
    return jsonify({"question": question, "answer": answer}), 200


@workers_bp.route('/loan-recommendation', methods=['GET'])
@jwt_required()
def get_loan_recommendation():
    """
    Feature 1 — Lender-side AI loan recommendation.
    Returns a structured loan recommendation card for the verified worker.
    Used by the lender verify page.
    """
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    signals = {
        "score": worker.trust_score,
        "worker_id": worker.worker_id,
        "name": worker.name,
        "job_completion_rate": 0.94,
        "income_consistency": 0.88,
        "platform_tenure_months": 18,
        "payment_punctuality": 0.92,
        "vouch_count": 7,
        "eshram_status": bool(worker.eshram_id),
        "bank_linked": bool(worker.upi_id),
        "platform_count": 1,
    }

    rec = loan_recommendation(signals)
    return jsonify(asdict(rec)), 200


@workers_bp.route('/anomaly-check', methods=['GET'])
@jwt_required()
def get_anomaly_check():
    """
    Feature 2 — Behavioral Anomaly Detector.
    Returns the risk profile for the authenticated worker.
    Used by the admin panel.
    """
    worker_id = get_jwt_identity()
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    if not worker:
        return jsonify({"error": "Worker not found"}), 404

    # In production these signals come from event logs and scoring history.
    signals = {
        "recent_vouch_spike": 0,
        "score_delta_last_cycle": 18,
        "aadhaar_hash_collision": False,
        "did_reuse": False,
        "new_device_new_location": False,
    }

    profile = anomaly_detector.analyse(worker.worker_id, worker.name, signals)
    return jsonify(asdict(profile)), 200
