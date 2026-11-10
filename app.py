"""
HandParticles - a real-time, hand-tracked particle playground.

Minimal Flask backend: serves the UI and persists the selected theme.
All hand detection (MediaPipe WASM) and rendering happens client-side,
so no video data ever leaves the browser.
"""

import logging
import signal
import socket
import sys
from threading import Lock

from flask import Flask, jsonify, render_template, request

# Keep the console clean: silence per-request werkzeug logs.
werkzeug_log = logging.getLogger("werkzeug")
werkzeug_log.setLevel(logging.ERROR)

app = Flask(__name__, template_folder="templates", static_folder="static")
# --- Theme state -----------------------------------------------------------

VALID_THEMES = [
    "Aurora", "Cyberpunk", "Rainbow", "Lava", "Ocean",
    "Galaxy", "Matrix", "Frostbite", "GoldenHour", "Synthwave",
    "NeonDemon", "Ultraviolet",
]
DEFAULT_THEME = "Aurora"

theme_state = {"current": DEFAULT_THEME}
theme_lock = Lock()
@app.route("/")
def index():
    """Serve the main application page."""
    return render_template("index.html")


@app.route("/get_theme", methods=["GET"])
def get_theme():
    """Return the active theme plus the list of available themes."""
    with theme_lock:
        theme = theme_state["current"]
    return jsonify({"theme": theme, "available_themes": VALID_THEMES})
@app.route("/update_theme", methods=["POST"])
def update_theme():
    """Persist a theme selection sent by the client."""
    data = request.get_json()
    theme = data.get("theme", DEFAULT_THEME)

    if theme not in VALID_THEMES:
        return jsonify({"status": "error", "message": "Invalid theme"}), 400

    with theme_lock:
        theme_state["current"] = theme
    return jsonify({"status": "success", "theme": theme})
@app.route("/health", methods=["GET"])
def health():
    """Liveness probe - handy for containers and uptime checks."""
    with theme_lock:
        theme = theme_state["current"]
    return jsonify({"status": "ok", "service": "handparticles", "theme": theme})
@app.route("/kill", methods=["POST"])
def kill_session():
    """Disconnect the client without shutting down the server."""
    print("Kill request received - disconnecting client session.")
    return jsonify({
        "status": "success",
        "message": "Client session terminated. Server remains running.",
    })
def _local_ip():
    """Best-effort lookup of the LAN address, for the startup banner."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"
BANNER = r"""
================================================
   H A N D P A R T I C L E S
   real-time hand-tracked particle playground
================================================
"""


def sigint_handler(sig, frame):
    print("\nShutting down HandParticles server...")
    sys.exit(0)
