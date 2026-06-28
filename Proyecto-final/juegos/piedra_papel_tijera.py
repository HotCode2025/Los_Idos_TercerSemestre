import random
from typing import Any

from api_error import ApiError


def choice_name(choice: int) -> str:
    return {1: "Piedra", 2: "Papel", 3: "Tijera"}[choice]


def wins(first: int, second: int) -> bool:
    return (first == 1 and second == 3) or (first == 2 and second == 1) or (first == 3 and second == 2)


def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "status": state["status"],
        "round": state.get("round", 1),
        "playerScore": state.get("playerScore", 0),
        "cpuScore": state.get("cpuScore", 0),
        "tieBreaker": state.get("tieBreaker", False),
        "last": state.get("last"),
        "message": state.get("message", "Elegí piedra, papel o tijera."),
    }


def start() -> dict[str, Any]:
    return {
        "status": "active", "round": 1, "playerScore": 0, "cpuScore": 0,
        "tieBreaker": False, "message": "Elegí para la ronda 1.",
    }


def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    if state["status"] != "active":
        return state, None, 0, "La partida ya terminó."
    try:
        player = int(data.get("choice"))
    except Exception:
        raise ApiError("Elegí 1, 2 o 3.")
    if player not in {1, 2, 3}:
        raise ApiError("Elegí 1=Piedra, 2=Papel o 3=Tijera.")
    cpu = random.randint(1, 3)
    if player == cpu:
        outcome = "Empate"
    elif wins(player, cpu):
        outcome = "Ganaste la ronda"
        state["playerScore"] += 1
    else:
        outcome = "Perdiste la ronda"
        state["cpuScore"] += 1
    state["last"] = {"player": choice_name(player), "cpu": choice_name(cpu), "outcome": outcome}

    if state.get("tieBreaker"):
        if player == cpu:
            state["message"] = "Empate en desempate. Elegí de nuevo."
            return state, None, 0, state["message"]
        if wins(player, cpu):
            state["status"] = "won"
            return state, "won", 1, "Ganaste el desempate."
        state["status"] = "lost"
        return state, "lost", 0, "Perdiste el desempate."

    if state["round"] < 3:
        state["round"] += 1
        state["message"] = f"{outcome}. Elegí para la ronda {state['round']}."
        return state, None, 0, state["message"]
    if state["playerScore"] > state["cpuScore"]:
        state["status"] = "won"
        return state, "won", state["playerScore"], f"Ganaste {state['playerScore']} a {state['cpuScore']}."
    if state["playerScore"] < state["cpuScore"]:
        state["status"] = "lost"
        return state, "lost", state["playerScore"], f"Perdiste {state['playerScore']} a {state['cpuScore']}."
    state["tieBreaker"] = True
    state["message"] = "Empate general. Ronda extra de desempate."
    return state, None, 0, state["message"]
