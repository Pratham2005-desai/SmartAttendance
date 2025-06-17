from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

import os

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["attendance_db"]

if __name__ == "__main__":
    # Import routes after db initialization to avoid circular imports
    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.attendance import attendance_bp
    from routes.leave import leave_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(leave_bp)

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
