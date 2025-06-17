from flask import Blueprint, request, jsonify
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        role = data.get("role")
        user_class = data.get("class")
        college_id = data.get("collegeId")
        password = data.get("password")

        if not name or not email or not role or not password:
            return jsonify({"error": "Name, email, role, and password are required"}), 400

        if role not in ["admin", "student"]:
            return jsonify({"error": "Role must be admin or student"}), 400

        existing_user = db.users.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400

        user_data = {
            "name": name,
            "email": email,
            "role": role,
            "password_hash": generate_password_hash(password)
        }

        if role == "student":
            user_data["class"] = user_class
            user_data["collegeId"] = college_id

        db.users.insert_one(user_data)

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Registration Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        college_id = data.get("collegeId")
        password = data.get("password")

        if not college_id or not password:
            return jsonify({"error": "College ID and password are required"}), 400

        user = db.users.find_one({"collegeId": college_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not check_password_hash(user.get("password_hash", ""), password):
            return jsonify({"error": "Invalid password"}), 400

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "_id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "class": user.get("class"),
                "collegeId": user.get("collegeId")
            },
            "token": "fake-token"
        }), 200

    except Exception as e:
        print("Login Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500
