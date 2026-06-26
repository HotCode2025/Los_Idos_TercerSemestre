from __future__ import annotations

import base64
import hashlib
import hmac
import html
import json
import os
import re
import secrets
import sqlite3
import tempfile
import time
from dotenv import load_dotenv

try:
    import certifi
except ImportError:
    certifi = None
from datetime import datetime
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

try:
    from pymongo import MongoClient, ReturnDocument
    from pymongo.errors import ConfigurationError, OperationFailure, DuplicateKeyError
except ImportError:
    MongoClient = None
    ReturnDocument = None
    ConfigurationError = None
    OperationFailure = None
    DuplicateKeyError = None

from api_error import ApiError
from juegos import ACTIONS, GAMES, PUBLIC, STARTERS

ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

STATIC_DIR = ROOT_DIR / "static"
IS_SERVERLESS = bool(os.getenv("VERCEL")) or bool(os.getenv("AWS_LAMBDA_FUNCTION_NAME"))
DATA_DIR = Path(tempfile.gettempdir()) / "los_idos_data" if IS_SERVERLESS else ROOT_DIR / "data"
DB_PATH = DATA_DIR / "los_idos.db"
HOST = "127.0.0.1"
PORT = 8000
MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGODB_DB") or os.getenv("MONGO_DB") or os.getenv("MONGO_DATABASE") or "los_idos"
USE_MONGO = bool(MONGO_URI) and MongoClient is not None and ReturnDocument is not None


def utc_now() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

class DBStore:
    def __init__(self) -> None:
        self.backend = "mongo" if USE_MONGO else "sqlite"
        self.sqlite_conn: sqlite3.Connection | None = None
        self.mongo_client: MongoClient | None = None
        self.mongo_db: Any = None

    def __enter__(self) -> "DBStore":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        self.close()

    def close(self) -> None:
        if self.sqlite_conn is not None:
            self.sqlite_conn.close()
            self.sqlite_conn = None
        if self.mongo_client is not None:
            self.mongo_client.close()
            self.mongo_client = None


def connect_db() -> DBStore:
    store = DBStore()
    if store.backend == "mongo":
        if MongoClient is None or ReturnDocument is None:
            raise RuntimeError("pymongo no está instalado. Ejecutá: pip install pymongo")
        try:
            mongo_options = {
                "serverSelectionTimeoutMS": 20000,
                "connectTimeoutMS": 20000,
                "socketTimeoutMS": 20000,
                "tls": True,
            }
            if certifi is not None:
                mongo_options["tlsCAFile"] = certifi.where()

            store.mongo_client = MongoClient(MONGO_URI, **mongo_options)
            store.mongo_db = store.mongo_client[MONGO_DB_NAME]
            store.mongo_client.admin.command("ping")
        except Exception as exc:
            raise RuntimeError(
                f"No se pudo conectar a MongoDB usando MONGODB_URI configurada y MONGODB_DB={MONGO_DB_NAME!r}: {exc}"
            ) from exc
    else:
        DATA_DIR.mkdir(exist_ok=True)
        store.sqlite_conn = sqlite3.connect(DB_PATH)
        store.sqlite_conn.row_factory = sqlite3.Row
    return store


def migrate_sqlite_to_mongo() -> None:
    db_file = DATA_DIR / "los_idos.db"
    if not db_file.exists():
        return

    sqlite_conn = sqlite3.connect(db_file)
    sqlite_conn.row_factory = sqlite3.Row
    try:
        users = sqlite_conn.execute("SELECT * FROM users").fetchall()
        login_sessions = sqlite_conn.execute("SELECT * FROM login_sessions").fetchall()
        game_sessions = sqlite_conn.execute("SELECT * FROM game_sessions").fetchall()
        scores = sqlite_conn.execute("SELECT * FROM scores").fetchall()
    finally:
        sqlite_conn.close()

    store = connect_db()
    if store.backend != "mongo":
        store.close()
        return

    db = store.mongo_db
    db.users.create_index("username", unique=True)
    db.login_sessions.create_index("token", unique=True)
    db.game_sessions.create_index([("user_id", 1), ("game_key", 1)])
    db.game_sessions.create_index("id", unique=True)
    db.scores.create_index([("user_id", 1), ("created_at", -1)])
    db.scores.create_index("id", unique=True)

    for row in users:
        db.users.update_one(
            {"_id": int(row["id"])},
            {"$setOnInsert": {
                "_id": int(row["id"]),
                "username": row["username"],
                "password_hash": row["password_hash"],
                "created_at": row["created_at"],
            }},
            upsert=True,
        )

    for row in login_sessions:
        db.login_sessions.update_one(
            {"token": row["token"]},
            {"$setOnInsert": {
                "token": row["token"],
                "user_id": int(row["user_id"]),
                "created_at": row["created_at"],
                "last_seen": row["last_seen"],
            }},
            upsert=True,
        )

    for row in game_sessions:
        db.game_sessions.update_one(
            {"id": int(row["id"])},
            {"$setOnInsert": {
                "id": int(row["id"]),
                "user_id": int(row["user_id"]),
                "game_key": row["game_key"],
                "status": row["status"],
                "state_json": row["state_json"],
                "started_at": row["started_at"],
                "ended_at": row["ended_at"],
            }},
            upsert=True,
        )

    for row in scores:
        db.scores.update_one(
            {"id": int(row["id"])},
            {"$setOnInsert": {
                "id": int(row["id"]),
                "user_id": int(row["user_id"]),
                "game_session_id": int(row["game_session_id"]) if row["game_session_id"] is not None else None,
                "game_key": row["game_key"],
                "result": row["result"],
                "score": int(row["score"]),
                "detail": row["detail"],
                "created_at": row["created_at"],
            }},
            upsert=True,
        )

    store.close()


def init_db() -> None:
    if USE_MONGO:
        migrate_sqlite_to_mongo()
    with connect_db() as store:
        if store.backend == "sqlite":
            store.sqlite_conn.executescript(
                """
                PRAGMA foreign_keys = ON;

                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS login_sessions (
                    token TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    created_at TEXT NOT NULL,
                    last_seen TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS game_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    game_key TEXT NOT NULL,
                    status TEXT NOT NULL,
                    state_json TEXT NOT NULL,
                    started_at TEXT NOT NULL,
                    ended_at TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    game_session_id INTEGER,
                    game_key TEXT NOT NULL,
                    result TEXT NOT NULL,
                    score INTEGER NOT NULL DEFAULT 0,
                    detail TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (game_session_id) REFERENCES game_sessions(id) ON DELETE SET NULL
                );
                """
            )
            store.sqlite_conn.commit()
        else:
            db = store.mongo_db
            db.users.create_index("username", unique=True)
            db.login_sessions.create_index("token", unique=True)
            db.game_sessions.create_index([("user_id", 1), ("game_key", 1)])
            db.game_sessions.create_index("id", unique=True)
            db.scores.create_index([("user_id", 1), ("created_at", -1)])
            db.scores.create_index("id", unique=True)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
    return base64.b64encode(salt + digest).decode("ascii")


def check_password(password: str, stored: str) -> bool:
    try:
        raw = base64.b64decode(stored.encode("ascii"))
        salt, digest = raw[:16], raw[16:]
        test = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
        return hmac.compare_digest(test, digest)
    except Exception:
        return False


def normalize_username(username: str) -> str:
    username = username.strip().lower()
    if not re.fullmatch(r"[a-zA-Z0-9_ñáéíóúü.-]{3,30}", username):
        raise ValueError("El usuario debe tener entre 3 y 30 caracteres. Usá letras, números, punto, guion o guion bajo.")
    return username


def validate_password(password: str) -> None:
    if len(password) < 4:
        raise ValueError("La contraseña debe tener al menos 4 caracteres.")


def find_user_by_username(store: DBStore, username: str) -> Any:
    """Busca usuarios sin depender de mayúsculas/minúsculas."""
    if store.backend == "sqlite":
        return store.sqlite_conn.execute(
            "SELECT * FROM users WHERE username = ? COLLATE NOCASE LIMIT 1",
            (username,),
        ).fetchone()
    return store.mongo_db.users.find_one(
        {"username": {"$regex": f"^{re.escape(username)}$", "$options": "i"}}
    )


def create_login_session(store: DBStore, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    now = utc_now()
    if store.backend == "sqlite":
        store.sqlite_conn.execute(
            "INSERT INTO login_sessions(token, user_id, created_at, last_seen) VALUES (?, ?, ?, ?)",
            (token, user_id, now, now),
        )
    else:
        store.mongo_db.login_sessions.insert_one(
            {"token": token, "user_id": user_id, "created_at": now, "last_seen": now}
        )
    return token


def user_from_token(store: DBStore, token: str | None) -> Any:
    if not token:
        return None
    if store.backend == "sqlite":
        row = store.sqlite_conn.execute(
            """
            SELECT users.id, users.username
            FROM login_sessions
            JOIN users ON users.id = login_sessions.user_id
            WHERE login_sessions.token = ?
            """,
            (token,),
        ).fetchone()
        if row:
            store.sqlite_conn.execute(
                "UPDATE login_sessions SET last_seen = ? WHERE token = ?",
                (utc_now(), token),
            )
        return row

    session = store.mongo_db.login_sessions.find_one({"token": token})
    if not session:
        return None
    store.mongo_db.login_sessions.update_one(
        {"token": token},
        {"$set": {"last_seen": utc_now()}},
    )
    user = store.mongo_db.users.find_one({"_id": session["user_id"]})
    if not user:
        return None
    return {"id": user["_id"], "username": user["username"]}


def next_sequence(store: DBStore, name: str) -> int:
    """
    Genera IDs numéricos para MongoDB de forma segura.

    Si la colección counters no existe o fue borrada, se reconstruye desde
    el ID máximo real de la colección correspondiente antes de incrementar.
    Esto evita errores E11000 duplicate key en Vercel/MongoDB.
    """
    if store.backend != "mongo":
        return 0

    counter = store.mongo_db.counters.find_one({"_id": name})

    if not counter:
        collection = store.mongo_db[name]

        if name == "users":
            last_doc = collection.find_one(
                {"_id": {"$type": "int"}},
                sort=[("_id", -1)],
            )
            current_max = int(last_doc["_id"]) if last_doc else 0
        else:
            last_doc = collection.find_one(
                {"id": {"$exists": True}},
                sort=[("id", -1)],
            )
            current_max = int(last_doc["id"]) if last_doc else 0

        store.mongo_db.counters.update_one(
            {"_id": name},
            {"$setOnInsert": {"value": current_max}},
            upsert=True,
        )

    doc = store.mongo_db.counters.find_one_and_update(
        {"_id": name},
        {"$inc": {"value": 1}},
        return_document=ReturnDocument.AFTER,
    )
    return int(doc["value"])


def create_game_session(store: DBStore, user_id: int, game_key: str, state: dict[str, Any]) -> int:
    if store.backend == "sqlite":
        cur = store.sqlite_conn.execute(
            """
            INSERT INTO game_sessions(user_id, game_key, status, state_json, started_at)
            VALUES (?, ?, 'active', ?, ?)
            """,
            (user_id, game_key, json.dumps(state, ensure_ascii=False), utc_now()),
        )
        return int(cur.lastrowid)

    session_id = next_sequence(store, "game_sessions")
    store.mongo_db.game_sessions.insert_one(
        {
            "id": session_id,
            "user_id": user_id,
            "game_key": game_key,
            "status": "active",
            "state_json": json.dumps(state, ensure_ascii=False),
            "started_at": utc_now(),
            "ended_at": None,
        }
    )
    return session_id


def load_game_session(store: DBStore, user_id: int, session_id: int, game_key: str) -> Any:
    if store.backend == "sqlite":
        row = store.sqlite_conn.execute(
            """
            SELECT * FROM game_sessions
            WHERE id = ? AND user_id = ? AND game_key = ?
            """,
            (session_id, user_id, game_key),
        ).fetchone()
        if not row:
            raise ApiError("No se encontró esa partida.", HTTPStatus.NOT_FOUND)
        return row

    row = store.mongo_db.game_sessions.find_one(
        {"id": session_id, "user_id": user_id, "game_key": game_key}
    )
    if not row:
        raise ApiError("No se encontró esa partida.", HTTPStatus.NOT_FOUND)
    return row


def save_state(store: DBStore, session_id: int, state: dict[str, Any], status: str = "active") -> None:
    ended_at = utc_now() if status in {"won", "lost", "cancelled"} else None
    if store.backend == "sqlite":
        store.sqlite_conn.execute(
            "UPDATE game_sessions SET state_json = ?, status = ?, ended_at = COALESCE(?, ended_at) WHERE id = ?",
            (json.dumps(state, ensure_ascii=False), status, ended_at, session_id),
        )
        return

    store.mongo_db.game_sessions.update_one(
        {"id": session_id},
        {"$set": {"state_json": json.dumps(state, ensure_ascii=False), "status": status, "ended_at": ended_at}},
    )


def record_score(
    store: DBStore,
    user_id: int,
    session_id: int,
    game_key: str,
    result: str,
    score: int,
    detail: str,
) -> None:
    if store.backend == "sqlite":
        store.sqlite_conn.execute(
            """
            INSERT INTO scores(user_id, game_session_id, game_key, result, score, detail, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, session_id, game_key, result, score, detail, utc_now()),
        )
        return

    # Evita duplicar puntajes si el frontend envía dos veces la acción final
    # o si una función serverless se reintenta.
    existing_score = store.mongo_db.scores.find_one(
        {"user_id": user_id, "game_session_id": session_id}
    )
    if existing_score:
        return

    score_id = next_sequence(store, "scores")
    try:
        store.mongo_db.scores.insert_one(
            {
                "id": score_id,
                "user_id": user_id,
                "game_session_id": session_id,
                "game_key": game_key,
                "result": result,
                "score": score,
                "detail": detail,
                "created_at": utc_now(),
            }
        )
    except Exception as exc:
        # Si el puntaje ya fue creado por una request simultánea, no rompas el juego.
        if "duplicate key error" in str(exc):
            return
        raise


class AppHandler(BaseHTTPRequestHandler):
    server_version = "LosIdosPython/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {self.client_address[0]} - {fmt % args}")

    def do_GET(self) -> None:
        self.route()

    def do_POST(self) -> None:
        self.route()

    def route(self) -> None:
        try:
            parsed = urlparse(self.path)
            path = parsed.path

            if path == "/":
                return self.serve_file(STATIC_DIR / "index.html", "text/html; charset=utf-8")

            if path.startswith("/static/"):
                rel = path.removeprefix("/static/")
                safe_rel = Path(rel)
                if ".." in safe_rel.parts:
                    raise ApiError("Ruta inválida", HTTPStatus.FORBIDDEN)
                return self.serve_file(STATIC_DIR / safe_rel)

            if path.startswith("/api/"):
                return self.route_api(path, parse_qs(parsed.query))

            raise ApiError("No encontrado", HTTPStatus.NOT_FOUND)

        except ApiError as exc:
            self.json_response({"ok": False, "error": exc.message}, exc.status)
        except (ConnectionAbortedError, BrokenPipeError, ConnectionResetError):
            return
        except Exception as exc:
            self.json_response({"ok": False, "error": f"Error interno: {exc}"}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def serve_file(self, path: Path, content_type: str | None = None) -> None:
        if not path.exists() or not path.is_file():
            raise ApiError("Archivo no encontrado", HTTPStatus.NOT_FOUND)
        if content_type is None:
            suffix = path.suffix.lower()
            content_type = {
                ".html": "text/html; charset=utf-8",
                ".css": "text/css; charset=utf-8",
                ".js": "application/javascript; charset=utf-8",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".svg": "image/svg+xml",
            }.get(suffix, "application/octet-stream")
        data = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            return {}
        body = self.rfile.read(length).decode("utf-8")
        try:
            data = json.loads(body)
            if not isinstance(data, dict):
                raise ValueError
            return data
        except Exception:
            raise ApiError("El body debe ser JSON válido.")

    def cookie_token(self) -> str | None:
        raw = self.headers.get("Cookie", "")
        cookie = SimpleCookie(raw)
        if "session_token" not in cookie:
            return None
        return cookie["session_token"].value

    def current_user(self, store: DBStore) -> Any:
        return user_from_token(store, self.cookie_token())

    def require_user(self, store: DBStore) -> Any:
        user = self.current_user(store)
        if not user:
            raise ApiError("Tenés que iniciar sesión.", HTTPStatus.UNAUTHORIZED)
        return user

    def json_response(
        self,
        payload: dict[str, Any],
        status: HTTPStatus = HTTPStatus.OK,
        cookie: str | None = None,
        clear_cookie: bool = False,
    ) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))

        if cookie:
            self.send_header("Set-Cookie", f"session_token={cookie}; HttpOnly; SameSite=Lax; Path=/")

        if clear_cookie:
            self.send_header("Set-Cookie", "session_token=; Max-Age=0; HttpOnly; SameSite=Lax; Path=/")

        try:
            self.end_headers()
            self.wfile.write(raw)
        except (ConnectionAbortedError, BrokenPipeError, ConnectionResetError):
            return

    def route_api(self, path: str, query: dict[str, list[str]]) -> None:
        method = self.command.upper()
        data = self.read_json() if method in {"POST", "PUT", "PATCH"} else {}
        with connect_db() as store:
            if store.backend == "sqlite":
                store.sqlite_conn.execute("PRAGMA foreign_keys = ON")
            if path == "/api/register" and method == "POST":
                username = normalize_username(str(data.get("username", "")))
                password = str(data.get("password", ""))
                validate_password(password)

                existing_user = find_user_by_username(store, username)
                if existing_user:
                    user_id = int(existing_user["id"]) if store.backend == "sqlite" else int(existing_user["_id"])
                    stored_hash = existing_user["password_hash"] if store.backend == "sqlite" else existing_user["password_hash"]
                    if check_password(password, stored_hash):
                        token = create_login_session(store, user_id)
                        if store.backend == "sqlite":
                            store.sqlite_conn.commit()
                        return self.json_response(
                            {
                                "ok": True,
                                "mode": "login",
                                "message": "Ese usuario ya existía, entonces se inició sesión normalmente.",
                                "user": {"id": user_id, "username": existing_user["username"]},
                            },
                            cookie=token,
                        )
                    raise ApiError("Ese usuario ya existe. Usá Ingresar con su contraseña correcta.", HTTPStatus.CONFLICT)

                if store.backend == "sqlite":
                    cur = store.sqlite_conn.execute(
                        "INSERT INTO users(username, password_hash, created_at) VALUES (?, ?, ?)",
                        (username, hash_password(password), utc_now()),
                    )
                    user_id = int(cur.lastrowid)
                else:
                    user_id = next_sequence(store, "users")
                    store.mongo_db.users.insert_one(
                        {
                            "_id": user_id,
                            "username": username,
                            "password_hash": hash_password(password),
                            "created_at": utc_now(),
                        }
                    )
                token = create_login_session(store, user_id)
                if store.backend == "sqlite":
                    store.sqlite_conn.commit()
                return self.json_response(
                    {
                        "ok": True,
                        "mode": "register",
                        "message": "Cuenta creada correctamente.",
                        "user": {"id": user_id, "username": username},
                    },
                    cookie=token,
                )

            if path == "/api/login" and method == "POST":
                username = normalize_username(str(data.get("username", "")))
                password = str(data.get("password", ""))
                row = find_user_by_username(store, username)
                if not row:
                    raise ApiError("Ese usuario no existe. Primero creá la cuenta.", HTTPStatus.UNAUTHORIZED)
                if store.backend == "sqlite":
                    user_id = int(row["id"])
                    stored_hash = row["password_hash"]
                else:
                    user_id = int(row["_id"])
                    stored_hash = row["password_hash"]
                if not check_password(password, stored_hash):
                    raise ApiError("Contraseña incorrecta para ese usuario.", HTTPStatus.UNAUTHORIZED)
                token = create_login_session(store, user_id)
                if store.backend == "sqlite":
                    store.sqlite_conn.commit()
                return self.json_response(
                    {
                        "ok": True,
                        "mode": "login",
                        "message": "Sesión iniciada correctamente.",
                        "user": {"id": user_id, "username": row["username"]},
                    },
                    cookie=token,
                )

            if path == "/api/users" and method == "GET":
                if store.backend == "sqlite":
                    rows = store.sqlite_conn.execute(
                        "SELECT id, username, created_at FROM users ORDER BY username COLLATE NOCASE"
                    ).fetchall()
                    return self.json_response({"ok": True, "users": [dict(r) for r in rows]})
                rows = list(store.mongo_db.users.find({}, {"_id": 1, "username": 1, "created_at": 1}).sort("username", 1))
                users = []
                for row in rows:
                    users.append({"id": row["_id"], "username": row["username"], "created_at": row.get("created_at")})
                return self.json_response({"ok": True, "users": users})

            if path == "/api/logout" and method == "POST":
                token = self.cookie_token()
                if token:
                    if store.backend == "sqlite":
                        store.sqlite_conn.execute("DELETE FROM login_sessions WHERE token = ?", (token,))
                        store.sqlite_conn.commit()
                    else:
                        store.mongo_db.login_sessions.delete_one({"token": token})
                return self.json_response({"ok": True}, clear_cookie=True)

            if path == "/api/me" and method == "GET":
                user = self.current_user(store)
                if store.backend == "sqlite":
                    store.sqlite_conn.commit()
                if not user:
                    return self.json_response({"ok": True, "user": None})
                return self.json_response({"ok": True, "user": {"id": user["id"], "username": user["username"]}})

            if path == "/api/games" and method == "GET":
                self.require_user(store)
                return self.json_response({"ok": True, "games": [{"key": k, "title": v} for k, v in GAMES.items()]})

            if path == "/api/scores" and method == "GET":
                user = self.require_user(store)
                if store.backend == "sqlite":
                    rows = store.sqlite_conn.execute(
                        """
                        SELECT game_key, result, score, detail, created_at
                        FROM scores
                        WHERE user_id = ?
                        ORDER BY id DESC
                        LIMIT 50
                        """,
                        (user["id"],),
                    ).fetchall()
                    summary_rows = store.sqlite_conn.execute(
                        """
                        SELECT game_key,
                               SUM(CASE WHEN result = 'won' THEN 1 ELSE 0 END) AS won,
                               SUM(CASE WHEN result = 'lost' THEN 1 ELSE 0 END) AS lost,
                               MAX(score) AS best_score
                        FROM scores
                        WHERE user_id = ? AND result IN ('won', 'lost')
                        GROUP BY game_key
                        """,
                        (user["id"],),
                    ).fetchall()
                    return self.json_response({
                        "ok": True,
                        "scores": [dict(r) for r in rows],
                        "summary": [dict(r) for r in summary_rows],
                        "gameTitles": GAMES,
                    })

                rows = list(
                    store.mongo_db.scores.find(
                        {"user_id": user["id"]},
                        {"_id": 0, "game_key": 1, "result": 1, "score": 1, "detail": 1, "created_at": 1}
                    ).sort("created_at", -1).limit(50)
                )
                summary_rows = list(store.mongo_db.scores.aggregate([
                    {"$match": {"user_id": user["id"], "result": {"$in": ["won", "lost"]}}},
                    {"$group": {
                        "_id": "$game_key",
                        "won": {"$sum": {"$cond": [{"$eq": ["$result", "won"]}, 1, 0]}},
                        "lost": {"$sum": {"$cond": [{"$eq": ["$result", "lost"]}, 1, 0]}},
                        "best_score": {"$max": "$score"}
                    }},
                    {"$project": {"game_key": "$_id", "won": 1, "lost": 1, "best_score": 1, "_id": 0}},
                    {"$sort": {"game_key": 1}}
                ]))
                return self.json_response({
                    "ok": True,
                    "scores": rows,
                    "summary": summary_rows,
                    "gameTitles": GAMES,
                })

            start_match = re.fullmatch(r"/api/games/([^/]+)/start", path)
            if start_match and method == "POST":
                game_key = start_match.group(1)
                if game_key not in GAMES:
                    raise ApiError("Juego inválido.", HTTPStatus.NOT_FOUND)
                user = self.require_user(store)
                state = STARTERS[game_key](data)
                session_id = create_game_session(store, int(user["id"]), game_key, state)
                if store.backend == "sqlite":
                    store.sqlite_conn.commit()
                return self.json_response({"ok": True, "game": game_key, "title": GAMES[game_key], "state": PUBLIC[game_key](state, session_id)})

            action_match = re.fullmatch(r"/api/games/([^/]+)/action", path)
            if action_match and method == "POST":
                game_key = action_match.group(1)
                if game_key not in GAMES:
                    raise ApiError("Juego inválido.", HTTPStatus.NOT_FOUND)
                user = self.require_user(store)
                try:
                    session_id = int(data.get("session_id"))
                except Exception:
                    raise ApiError("Falta session_id de la partida.")
                row = load_game_session(store, int(user["id"]), session_id, game_key)
                state = json.loads(row["state_json"])
                state, result, score, detail = ACTIONS[game_key](state, data)
                status_for_db = state["status"] if state["status"] in {"won", "lost", "cancelled"} else "active"
                save_state(store, session_id, state, status_for_db)
                if result in {"won", "lost"}:
                    record_score(store, int(user["id"]), session_id, game_key, result, score, detail)
                if store.backend == "sqlite":
                    store.sqlite_conn.commit()
                return self.json_response({"ok": True, "game": game_key, "title": GAMES[game_key], "state": PUBLIC[game_key](state, session_id)})

            raise ApiError("Endpoint no encontrado", HTTPStatus.NOT_FOUND)


def main() -> None:
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print("Legión Binaria - versión Python + HTML/CSS/JavaScript")
    print(f"Servidor iniciado en http://{HOST}:{PORT}")
    if USE_MONGO and MONGO_URI:
        print(f"Base de datos MongoDB: {MONGO_DB_NAME} ({MONGO_URI.split('@')[-1].split('/')[-2] if '@' in MONGO_URI else 'URI configurada'})")
    else:
        print(f"Base de datos SQLite: {DB_PATH}")
    print("Presioná Ctrl+C para detener.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
