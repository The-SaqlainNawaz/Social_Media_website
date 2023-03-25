"""
Database models
"""
from . import Base
from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime


class User(Base):
    __tablename__ = 'user'

    id = id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.now())

    def __init__(self, username: str = None, email: str = None, password: str = None):
        self.username = username
        self.password = password
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username

    def serialize(self):
        return {
            'id': str(self.id),
            'name': self.username,
            'email': self.email,
            'updated_at': str(self.updated_at),
            'created_at': str(self.created_at)
        }


class Post(Base):
    __tablename__ = 'post'

    id = id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey(
        'user.id', ondelete="cascade"), nullable=False)
    caption = Column(String(255), nullable=False)
    image_url = Column(String(1500), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.now())

    def __init__(self, user_id: str = None, caption: str = None, image_url: str = None):
        self.user_id = user_id
        self.caption = caption
        self.image_url = image_url

    def serialize(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'caption': self.caption,
            'image_url': self.image_url,
            'updated_at': str(self.updated_at),
            'created_at': str(self.created_at)
        }


class Friend(Base):
    __tablename__ = 'friend'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey(
        'user.id', ondelete="cascade"), nullable=False)
    friend_id = Column(Integer, ForeignKey(
        'user.id', ondelete="cascade"), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.now())

    # Define the relationship to the User table
    user = relationship('User', foreign_keys=[user_id])
    friend = relationship('User', foreign_keys=[friend_id])

    def __init__(self, user_id=None, friend_id=None):
        self.user_id = user_id
        self.friend_id = friend_id

    def serialize(self):
        return {
            'id': str(self.id),
            'user': self.user.serialize(),
            'friend': self.friend.serialize(),
            'updated_at': str(self.updated_at),
            'created_at': str(self.created_at)
        }


class Message(Base):
    __tablename__ = 'message'

    id = id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey(
        'user.id', ondelete="cascade"), nullable=False)
    friend_id = Column(Integer, ForeignKey(
        'user.id', ondelete="cascade"), nullable=False)
    message = Column(String(255), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.now())

    def __init__(self, user_id: str = None, friend_id: str = None, message: str = None):
        self.user_id = user_id
        self.friend_id = friend_id
        self.message = message

    def serialize(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'friend_id': str(self.friend_id),
            'message': self.message,
            'updated_at': str(self.updated_at),
            'created_at': str(self.created_at)
        }
