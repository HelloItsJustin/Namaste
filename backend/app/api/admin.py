from flask import Blueprint, jsonify
from app.models.models import Worker, Credential, Dividend, db
from app.services.ai_service import trust_score_engine

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def get_admin_stats():
    """Global system health and performance metrics"""
    return jsonify({
        "total_workers": Worker.query.count(),
        "active_credentials": Credential.query.count(),
        "total_dividends_paid": sum(d.amount for d in Dividend.query.filter_by(type='credit', status='confirmed').all()),
        "blockchain": {
            "network": "Polygon Mumbai",
            "status": "Healthy",
            "last_block": 43891234
        }
    }), 200

@admin_bp.route('/workers', methods=['GET'])
def list_workers():
    """Admin worker registry overview"""
    workers = Worker.query.all()
    data = [{
        "worker_id": w.worker_id,
        "name": w.name,
        "occupation": w.occupation,
        "location": w.location,
        "did": w.did,
        "trust_score": w.trust_score
    } for w in workers]
    
    return jsonify(data), 200

@admin_bp.route('/ai/metrics', methods=['GET'])
def get_ai_metrics():
    """AI TrustScore model performance and fairness audit"""
    # Simulate a fairness audit
    audit = trust_score_engine.audit_fairness(None, None)
    return jsonify({
        "model_version": "v2.4.1 (XGBoost)",
        "gini_coefficient": 0.64,
        "fairness_audit": audit
    }), 200
