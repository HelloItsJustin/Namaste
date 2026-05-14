import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'namaste-secret-key-change-in-prod')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///namaste.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'namaste-jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
    
    # Mock API URLs (Simulated)
    AADHAAR_API_URL = "https://mock.uidai.gov.in/otp"
    ESHRAM_API_URL = "https://mock.eshram.gov.in/verify"
    ONDC_API_URL = "https://mock.ondc.org/data"
    
    # Polygon / Blockchain Config
    POLYGON_RPC_URL = os.environ.get('POLYGON_RPC_URL', 'https://rpc-mumbai.maticvigil.com')
    CONTRACT_ADDRESS_REGISTRY = os.environ.get('CONTRACT_ADDRESS_REGISTRY', '0x0000000000000000000000000000000000000000')
    CONTRACT_ADDRESS_DIVIDEND = os.environ.get('CONTRACT_ADDRESS_DIVIDEND', '0x0000000000000000000000000000000000000000')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    # Enforce TLS 1.3
    PREFERRED_URL_SCHEME = 'https'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
