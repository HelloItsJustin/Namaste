from flask import Blueprint, request, jsonify
from app.models.models import Worker, TrustScoreHistory
from app.services.ai_service import trust_score_engine

lenders_bp = Blueprint('lenders', __name__)

@lenders_bp.route('/verify', methods=['POST'])
def verify_worker():
    """
    Verify Worker ZK-Proof result and return TrustScore.
    Simulates checking a ZK-Proof submitted by a worker.
    """
    data = request.get_json()
    worker_id = data.get('worker_id')
    # In a real ZK scenario, we would verify the proof here.
    
    worker = Worker.query.filter_by(worker_id=worker_id).first()
    if not worker:
        return jsonify({"error": "Worker profile not found"}), 404
        
    return jsonify({
        "status": "verified",
        "worker": {
            "name": worker.name,
            "worker_id": worker.worker_id,
            "location": worker.location,
            "occupation": worker.occupation,
            "platform": worker.platform,
        },
        "trust_score": worker.trust_score,
        "recommendation": "Pre-approved up to ₹50,000" if worker.trust_score > 700 else "Standard limits apply"
    }), 200

@lenders_bp.route('/reports', methods=['GET'])
def get_lender_reports():
    """Aggregated, anonymized analytics for lenders"""
    # Simulate aggregation
    return jsonify({
        "total_verifications": 1847,
        "pre_approved_loans": 312,
        "avg_trust_score": 681,
        "acceptance_rate": 76.4,
        "occupation_breakdown": {
            "Delivery": 42,
            "Home Services": 24,
            "Auto/Bike": 18,
            "Construction": 10,
            "Domestic": 6
        }
    }), 200
