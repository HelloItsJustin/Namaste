from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class Worker(db.Model):
    __tablename__ = 'workers'
    
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.String(32), unique=True, index=True) # W-2024-MH-00781
    did = db.Column(db.String(128), unique=True, index=True)
    name = db.Column(db.String(128))
    phone = db.Column(db.String(20), unique=True, index=True)
    email = db.Column(db.String(120), unique=True)
    aadhaar_hash = db.Column(db.String(128)) # SHA-256
    eshram_id = db.Column(db.String(32))
    location = db.Column(db.String(256))
    occupation = db.Column(db.String(128))
    platform = db.Column(db.String(64))
    upi_id = db.Column(db.String(128))
    wallet_address = db.Column(db.String(128))
    
    trust_score = db.Column(db.Integer, default=300)
    onboarded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    credentials = db.relationship('Credential', backref='worker', lazy='dynamic')
    dividends = db.relationship('Dividend', backref='worker', lazy='dynamic')
    trust_scores = db.relationship('TrustScoreHistory', backref='worker', lazy='dynamic')

class Credential(db.Model):
    __tablename__ = 'credentials'
    
    id = db.Column(db.Integer, primary_key=True)
    vc_id = db.Column(db.String(64), unique=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'))
    type = db.Column(db.String(64))
    title = db.Column(db.String(128))
    issuer = db.Column(db.String(128))
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    expiry_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='active') # active, revoked
    ipfs_hash = db.Column(db.String(128))
    onchain_hash = db.Column(db.String(128))
    encrypted_data = db.Column(db.JSON) # Jlyn encrypted

class Dividend(db.Model):
    __tablename__ = 'dividends'
    
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'))
    amount = db.Column(db.Float)
    source = db.Column(db.String(128)) # Swiggy Data Usage, etc.
    type = db.Column(db.String(10)) # credit, debit
    tx_hash = db.Column(db.String(128))
    status = db.Column(db.String(20), default='pending') # pending, confirmed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TrustScoreHistory(db.Model):
    __tablename__ = 'trust_score_history'
    
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'))
    score = db.Column(db.Integer)
    delta = db.Column(db.Integer)
    explanation = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
