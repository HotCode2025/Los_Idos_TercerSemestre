import random
from typing import Any

from api_error import ApiError


def lane_name(lane: int) -> str:
    return {1: "Izquierda", 2: "Centro", 3: "Derecha"}[lane]


def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "status": state["status"],
        "goals": state.get("goals", 0),
        "saves": state.get("saves", 0),
        "last": state.get("last"),
        "message": state.get("message", "Elegí dónde patear."),
    }


def start() -> dict[str, Any]:
    return {
        "status": "active", "goals": 0, "saves": 0,
        "message": "Objetivo: anotar 7 goles antes de que el arquero ataje 3.",
    }


def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    if state["status"] != "active":
        return state, None, 0, "La partida ya terminó."
    try:
        shot = int(data.get("shot"))
    except Exception:
        raise ApiError("Elegí 1, 2 o 3.")
    if shot not in {1, 2, 3}:
        raise ApiError("Elegí 1=Izq, 2=Centro o 3=Der.")
    keeper = random.randint(1, 3)
    saved = shot == keeper
    if saved:
        state["saves"] += 1
        message = "¡ATAJADA!"
    else:
        state["goals"] += 1
        message = "¡GOOOOL!"
    state["last"] = {"shot": lane_name(shot), "keeper": lane_name(keeper), "saved": saved}
    state["message"] = message
    if state["goals"] >= 7:
        state["status"] = "won"
        return state, "won", state["goals"], "Ganaste la tanda de penales."
    if state["saves"] >= 3:
        state["status"] = "lost"
        return state, "lost", state["goals"], "Perdiste: el arquero atajó 3."
    return state, None, 0, message
