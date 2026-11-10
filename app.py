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
