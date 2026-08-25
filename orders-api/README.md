# Orders API

Small internal API used by the operations dashboard.

## Setup

Requires Python 3.11 or newer.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

The API documentation is available at `http://localhost:8000/docs` and the
health endpoint is at `http://localhost:8000/health`.

## Tests

```bash
pytest
```
