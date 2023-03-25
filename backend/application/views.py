from flask import (
    Blueprint,
    request,
    jsonify,
)
from application.models import (
    User,
    Post,
    Friend,
    Message,
)
from application.shared.utils import get_password_hash, verify_password
from application import (
    sessiondb,
)
from typing import List
from sqlalchemy import and_, or_
from werkzeug.utils import secure_filename
import os

main = Blueprint('main', __name__)
path = "/home/saqlainnawaz/BS Computer Science/Jawad/Final/socialMedia/frontend/"

@main.route('/signup', methods=['POST'])
def signup():
    """Create a new user."""
    try:
        # Get user details from request body
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = get_password_hash(data['password'])

        # Check if user already exists
        existing_user = sessiondb.query(
            User).filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username already taken'}), 400

        # Create new user
        new_user = User(username=username, email=email, password=password)
        sessiondb.add(new_user)
        sessiondb.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/login', methods=['POST'])
def login():
    """Login a user."""
    try:
        # Get user details from request body
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Check if user exists and verify password
        user = sessiondb.query(User).filter_by(username=username).first()
        if not user or not verify_password(password, user.password):
            return jsonify({'error': 'Invalid username or password'}), 401

        return jsonify({'message': 'Login successful', 'user': user.serialize()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/post', methods=['POST'])
def post(user_id):
    """Create a new post for a user."""
    
    try:
        # Get user details from request body
        caption = request.form.get('caption')
        print(caption)
        image = request.files.get('image')
        # print(image)

        # Check if user exists
        user = sessiondb.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Save image to disk
        if image:
            filename = secure_filename(image.filename)
            image_path = os.path.join(path,
                'public/images/', filename)
            image.save(image_path)
            print(image_path)
        
            # Create new post
            new_post = Post(caption=caption,
                            image_url=filename, user_id=user.id)
            sessiondb.add(new_post)
            sessiondb.commit()

            return jsonify({'message': 'Post created successfully'}), 201
        else:
            return jsonify({'error': 'No image uploaded'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>')
def get_user_profile(user_id):
    """Get a user's profile data."""
    try:
        # Get user details from database
        user: User = sessiondb.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get user's posts from database
        posts: List[Post] = sessiondb.query(
            Post).filter_by(user_id=user.id).all()
        post_data = []
        for post in posts:
            post_data.append(post.serialize())

        # Get user's friends count from database
        friends_count = sessiondb.query(
            Friend).filter_by(user_id=user.id).count()

        # Return user profile data
        return jsonify({
            'user': user.serialize(),
            'posts': post_data,
            'friends_count': friends_count,
            'posts_count': len(post_data)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/post')
def get_user_recent_post(user_id):
    """Get a user's most recent post."""
    try:
        # Get user details from database
        user = sessiondb.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Get user's posts from database
        post = sessiondb.query(Post).filter_by(
            user_id=user.id).order_by(Post.created_at.desc()).first()
        if not post:
            return jsonify({'error': 'User has no posts'}), 404

        # Return user profile data
        return jsonify(post.serialize()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/friends/<friend_id>/add', methods=['POST'])
def add_friend(user_id: int, friend_id: int):
    """Add a friend to a user's friend list."""
    try:
        # Check if both user and friend exist
        user = sessiondb.query(User).filter_by(id=user_id).first()
        friend = sessiondb.query(User).filter_by(id=friend_id).first()
        if not user or not friend:
            return jsonify({'error': 'User or friend not found.'}), 404

        # Check if the friendship already exists
        friendship1 = sessiondb.query(Friend).filter_by(
            user_id=user_id, friend_id=friend_id).first()
        friendship2 = sessiondb.query(Friend).filter_by(
            user_id=friend_id, friend_id=user_id).first()
        if friendship1 or friendship2:
            return jsonify({'error': 'Friendship already exists.'}), 400

        # Add friendship to database
        new_friendship1 = Friend(user_id=user_id, friend_id=friend_id)
        new_friendship2 = Friend(user_id=friend_id, friend_id=user_id)
        sessiondb.add(new_friendship1)
        sessiondb.add(new_friendship2)
        sessiondb.commit()

        return jsonify({'message': 'Friend added successfully.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/friends/suggestions')
def get_friend_suggestions(user_id: int):
    """Get a list of users who are not friends with the user."""
    try:
        # Get user's friends
        friends = sessiondb.query(Friend).filter_by(user_id=user_id).all()
        friend_ids = [friend.friend_id for friend in friends]

        # Get users who are not friends with the user
        users = sessiondb.query(User).filter(User.id.notin_(
            friend_ids)).filter(User.id != user_id).all()
        user_data = []
        for user in users:
            user_data.append(user.serialize())

        return jsonify({'users': user_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/friends')
def get_friends(user_id: int):
    """Get a list of friends of a user."""
    try:
        friends = sessiondb.query(Friend).filter_by(user_id=user_id).all()
        friend_data = []
        for friend in friends:
            friend_data.append(friend.serialize())

        return jsonify({'friends': friend_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/friend/<friend_id>/chats', methods=['POST'])
def send_message(user_id: int, friend_id: int):
    """Send a message to a friend."""
    try:
        data = request.json
        message = data.get('message')

        # Validate input data
        if not friend_id or not message:
            return jsonify({'error': 'Invalid input data.'}), 400

        # Check if the friend is a valid friend of the logged-in user
        friend = sessiondb.query(Friend).filter_by(
            user_id=user_id, friend_id=friend_id).first()
        if not friend:
            return jsonify({'error': 'Friend not found.'}), 404

        # Create a new message
        message = Message(
            user_id=user_id, friend_id=friend_id, message=message)
        sessiondb.add(message)
        sessiondb.commit()
        

        return jsonify({'message': 'Message sent successfully.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/chats/<friend_id>', methods=['GET'])
def get_chat_history(user_id: int, friend_id: int):
    """Get the entire chat history between two users."""
    try:
        # Check if both users exist
        user = sessiondb.query(User).filter_by(id=user_id).first()
        friend = sessiondb.query(User).filter_by(id=friend_id).first()
        if not user or not friend:
            return jsonify({'error': 'User or friend not found.'}), 404

        # Query the message table to get all messages between the users
        messages = sessiondb.query(Message).filter(or_(
            and_(Message.user_id == user_id, Message.friend_id == friend_id),
            and_(Message.user_id == friend_id, Message.friend_id == user_id)
        )).order_by(Message.created_at).all()

        # Serialize the results and return as JSON
        serialized_messages = []
        for message in messages:
            serialized_messages.append(message.serialize())

        return jsonify(serialized_messages), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/user/<user_id>/chats', methods=['GET'])
def get_chats(user_id: int):
    """Get all chats for a user."""
    try:
        # Check if user exists
        user = sessiondb.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({'error': 'User not found.'}), 404

        # Query the message table to get all chats for the user
        chats = sessiondb.query(Message.friend_id).filter_by(
            user_id=user_id).group_by(Message.friend_id).all()

        # Serialize the results and return as JSON
        serialized_chats = []
        for chat in chats:
            friend_id = chat[0]
            friend: User = sessiondb.query(User).filter_by(id=friend_id).first()
            last_message: Message = sessiondb.query(Message).filter_by(
                user_id=user_id, friend_id=friend_id).order_by(Message.created_at.desc()).first()
            if last_message:
                last_message_text = last_message.message
                last_message_time = last_message.created_at.strftime(
                    '%Y-%m-%d %H:%M:%S')
            else:
                last_message_text = ''
                last_message_time = ''
            serialized_chats.append({
                'friend_id': str(friend_id),
                'friend_name': friend.username,
                'last_message_text': last_message_text,
                'last_message_time': last_message_time
            })

        return jsonify(serialized_chats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
