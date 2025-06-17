import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("MAIL_USERNAME")

print(f"DEBUG: SENDGRID_API_KEY loaded: {'Yes' if SENDGRID_API_KEY else 'No'} (starts with {SENDGRID_API_KEY[:5]}... if loaded)")
print(f"DEBUG: FROM_EMAIL loaded: {FROM_EMAIL}")

def send_otp_email(to_email, otp):
    print(f"DEBUG: Attempting to send OTP {otp} to {to_email} from {FROM_EMAIL}")
    try:
        if not SENDGRID_API_KEY:
            print("ERROR: SENDGRID_API_KEY is not set. Cannot send email.")
            return False
        if not FROM_EMAIL:
            print("ERROR: FROM_EMAIL is not set. Cannot send email.")
            return False

        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject="Your TransStadia OTP",
            plain_text_content=f"Your OTP is: {otp}",
            html_content=f"<strong>Your OTP is: {otp}</strong>"
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"SendGrid Response Status Code: {response.status_code}")
        print(f"SendGrid Response Body: {response.body.decode('utf-8') if response.body else 'No body'}") # Decode if present
        print(f"SendGrid Response Headers: {response.headers}")
        return response.status_code == 202
    except Exception as e:
        print(f"EMAIL ERROR: An exception occurred: {e}")
        return False

# Example call (for testing)
# if __name__ == "__main__":
#     test_email = "your_recipient_email@example.com" # Use a real email you can check
#     test_otp = "123456"
#     print(f"Calling send_otp_email for test purposes...")
#     if send_otp_email(test_email, test_otp):
#         print("Test email sent successfully (status 202). Check inbox.")
#     else:
#         print("Test email failed to send.")