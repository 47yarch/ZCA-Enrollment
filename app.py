from flask import Flask, send_from_directory

app = Flask(__name__)


from flask import request, jsonify
import requests

GOOGLE_SCRIPT_URL = (
    "https://script.google.com/macros/s/"
    "AKfycbwj2rlIqFJ1RTLTV30fjwEnbQQGp8FvTzC1C7nzqzhESxhn_BeEthDOtxLl3Hc0d4Vr/exec"
)


@app.route("/submit-enrollment", methods=["POST"])
def submit_enrollment():
    try:
        # Receive the enrollment form from the browser.
        enrollment_data = request.form.to_dict()

        if not enrollment_data:
            return jsonify({
                "success": False,
                "message": "No enrollment form data was received."
            }), 400

        # Forward the form to Google Apps Script from the server.
        response = requests.post(
            GOOGLE_SCRIPT_URL,
            data=enrollment_data,
            timeout=45,
            allow_redirects=True
        )

        if not response.ok:
            app.logger.error(
                "Google Apps Script returned HTTP %s: %s",
                response.status_code,
                response.text[:500]
            )
            return jsonify({
                "success": False,
                "message": "Google Apps Script returned an error."
            }), 502

        # Log the upstream response so you can inspect it in the terminal.
        app.logger.info(
            "Google Apps Script response: %s",
            response.text[:1000]
        )

        # This confirms the upstream HTTP request completed, but does
        # not independently confirm that the Sheet and email succeeded.
        return jsonify({
            "success": True,
            "message": "The request reached Google Apps Script.",
            "upstreamStatus": response.status_code
        }), 200

    except requests.RequestException:
        app.logger.exception("Could not contact Google Apps Script")
        return jsonify({
            "success": False,
            "message": "Could not contact Google Apps Script."
        }), 502


@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/enrollment")
def enrollment():
    return send_from_directory(".", "enrollment.html")

@app.route("/class-policy")
def class_policy():
    return send_from_directory(".", "class-policy.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    app.run(debug=True)