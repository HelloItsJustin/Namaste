from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from app.models.models import Worker, db
from app.services.jlyn_service import jlyn_cipher
import secrets

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/onboarding/otp', methods=['POST'])
def send_otp():
    """Mock Aadhaar OTP API"""
    data = request.get_json()
    aadhaar = data.get('aadhaar')
    if not aadhaar or len(aadhaar.replace(' ', '')) != 12:
        return jsonify({"error": "Invalid Aadhaar number"}), 400
    
    # In reality, call Twilio or Aadhaar API
    return jsonify({"message": "OTP sent to registered mobile", "status": "success"}), 200

@auth_bp.route('/onboarding/verify', methods=['POST'])
def verify_otp():
    """Verify OTP and initialize worker DID"""
    data = request.get_json()
    otp = data.get('otp')
    if otp != '123456': # Demo OTP
        return jsonify({"error": "Invalid OTP"}), 401
    
    # Create DID (Simulated)
    did = f"did:polygon:0x{secrets.token_hex(20)}"
    return jsonify({
        "message": "Identity verified",
        "did": did,
        "status": "success"
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    """Complete worker registration and create JWT"""
    data = request.get_json()
    
    # Check if worker exists
    if Worker.query.filter_by(phone=data.get('phone')).first():
        return jsonify({"error": "Worker already registered"}), 400
        
    new_worker = Worker(
        worker_id=f"W-2024-MH-{secrets.token_hex(4).upper()}",
        did=data.get('did'),
        name=data.get('name'),
        phone=data.get('phone'),
        email=data.get('email'),
        eshram_id=data.get('eshram_id'),
        location=data.get('location'),
        occupation=data.get('occupation'),
        platform=data.get('platform'),
        upi_id=data.get('upi_id'),
        wallet_address=f"0x{secrets.token_hex(20)}"
    )
    
    db.session.add(new_worker)
    db.session.commit()
    
    access_token = create_access_token(identity=new_worker.worker_id)
    refresh_token = create_refresh_token(identity=new_worker.worker_id)
    
    return jsonify({
        "status": "success",
        "worker_id": new_worker.worker_id,
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 201
