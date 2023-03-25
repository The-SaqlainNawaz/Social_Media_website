"""
Main Application package.
"""
from flask import Flask
from flask_cors import CORS
from application.shared.secrets import secrets
from sqlalchemy.ext.declarative import declarative_base
from application.settings.db_config import init_connection_engine
from sqlalchemy.orm import (
    scoped_session,
    sessionmaker
)

# Database configuration
engine = init_connection_engine()
Session = scoped_session(sessionmaker(bind=engine))
Base = declarative_base()
sessiondb = Session()

# Set up file uploads


def register_blueprints(app):
    """
    This function registers flask blueprints to flask application
    """
    from .views import main as main_blueprint
    app.register_blueprint(main_blueprint)
    return None


def create_app():
    """
    this function create Flask Application
    """
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    register_blueprints(app)
    app.config['SECRET_KEY'] = secrets['secret_key']
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    return app
