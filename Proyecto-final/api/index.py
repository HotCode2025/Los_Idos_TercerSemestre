import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app import AppHandler, init_db

try:
    init_db()
except Exception as exc:
    print(f"init_db warning: {exc}")


class handler(AppHandler):
    pass
