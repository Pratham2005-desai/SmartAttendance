import os
from app import db
from werkzeug.security import generate_password_hash

def create_temp_admin():
    email = "tempadmin@example.com"
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        print("Temporary admin user already exists.")
        return

    admin_user = {
        "collegeId": "tempadmin123",
        "name": "Temporary Admin",
        "email": email,
        "role": "admin",
        "password_hash": generate_password_hash("TempAdminPass123"),
    }

    db.users.insert_one(admin_user)
    print(f"Temporary admin user created with email: {email}, collegeId: {admin_user['collegeId']} and password: TempAdminPass123")

if __name__ == "__main__":
    create_temp_admin()
