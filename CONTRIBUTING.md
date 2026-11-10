# Contributing to HandParticles

Thanks for wanting to help! This project is small on purpose, so the rules are light.

## Getting set up

1. Fork and clone the repo
2. `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. `pip install -r requirements.txt`
4. `python app.py` and open https://localhost:5000

## Ground rules

- Keep the backend minimal - everything visual belongs in `static/js/`
- Match the existing style: ES modules, no build step, no frameworks
- Test with a real webcam before opening a PR - a screenshot or short clip helps
## Pull requests

1. Branch from `main`: `git checkout -b feature/my-feature`
2. Keep commits small and titled like `feat(engine): ...`, `fix(ui): ...`, `docs: ...`
3. Make sure `python -m py_compile app.py` passes and the CI workflows are green
4. Open the PR with a short description of what changed and why

## Reporting bugs

Open an issue with your OS, browser and camera setup, plus the console output from the browser dev tools.
