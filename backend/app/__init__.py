from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from celery import Celery
from config import config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
celery = Celery(__name__)

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Configure Celery
    celery.conf.update(app.config)
    
    # Import and register blueprints/resources here
    from app.api.auth import auth_bp
    from app.api.workers import workers_bp
    from app.api.lenders import lenders_bp
    from app.api.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workers_bp, url_prefix='/api/workers')
    app.register_blueprint(lenders_bp, url_prefix='/api/lenders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    return app
