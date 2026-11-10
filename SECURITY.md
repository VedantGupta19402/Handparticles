# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a vulnerability

If you find a security issue, please email vedantguptav@gmail.com instead of opening a public issue. Include steps to reproduce if possible. You should get a reply within a few days.

Please do not run automated scanners against the live demo endpoint.
## Scope

HandParticles is designed to run locally:

- The Flask server binds to `0.0.0.0` for LAN convenience - switch to `127.0.0.1` in `app.py` if you do not want other devices on your network to reach it
- Video never leaves the browser; the only server-side state is the selected theme name
- Plain HTTP by default (localhost is a secure context, so the camera still works); set `HANDPARTICLES_SSL=1` for HTTPS with a self-signed certificate when other LAN devices need access

If you expose the app beyond your LAN (e.g. via a reverse proxy), you take responsibility for authentication and TLS in front of it.
