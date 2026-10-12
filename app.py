from flask import Flask, send_from_directory

app = Flask(__name__)

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