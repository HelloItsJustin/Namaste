from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.models import Worker, Credential, Dividend, db
from app.services.ai_service import trust_score_engine

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
