import random
from typing import Any


def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "status": state["status"],
        "carLane": state["carLane"],
        "obsLane": state.get("obsLane"),
        "dodged": state.get("dodged", 0),
        "target": 5,
        "message": state.get("message", ""),
    }


def start() -> dict[str, Any]:
    return {
        "status": "active",
        "carLane": 1,
        "obsLane": random.randint(0, 2),
        "dodged": 0,
        "message": "Mové el auto para evitar el obstáculo.",
    }


def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    if state["status"] != "active":
        return state, None, 0, "La partida ya terminó."
    move = str(data.get("move", "w")).lower()
    if move == "q":
        state["status"] = "cancelled"
        state["message"] = "Juego cancelado."
        return state, "cancelled", 0, state["message"]
    if move == "a" and state["carLane"] > 0:
        state["carLane"] -= 1
    elif move == "d" and state["carLane"] < 2:
        state["carLane"] += 1

    if state["carLane"] == state["obsLane"]:
        state["status"] = "lost"
        state["message"] = "¡PERDISTE! Te chocaste."
        return state, "lost", state["dodged"], f"Chocaste después de esquivar {state['dodged']} obstáculos."

    state["dodged"] += 1
    if state["dodged"] >= 5:
        state["status"] = "won"
        state["message"] = "¡GANASTE! Esquivaste 5 obstáculos."
        return state, "won", 5, state["message"]
    state["obsLane"] = random.randint(0, 2)
    state["message"] = "¡Obstáculo esquivado!"
    return state, None, 0, state["message"]
