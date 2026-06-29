from typing import Any

from api_error import ApiError


def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "status": state["status"],
        "n": state["n"],
        "towers": state["towers"],
        "moves": state.get("moves", 0),
        "minimum": 2 ** state["n"] - 1,
        "message": state.get("message", "Mové todos los discos a la torre 3."),
    }


def start(n: int) -> dict[str, Any]:
    if n < 2 or n > 8:
        raise ApiError("La cantidad de discos debe ser entre 2 y 8.")
    return {
        "status": "active",
        "n": n,
        "towers": [list(range(1, n + 1)), [], []],
        "moves": 0,
        "message": "Regla: no podés poner un disco grande sobre uno chico.",
    }


def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    if state["status"] != "active":
        return state, None, 0, "La partida ya terminó."
    try:
        source = int(data.get("source")) - 1
        target = int(data.get("target")) - 1
    except Exception:
        raise ApiError("Elegí torre origen y destino del 1 al 3.")
    if source not in {0, 1, 2} or target not in {0, 1, 2}:
        raise ApiError("Las torres deben ser 1, 2 o 3.")
    if source == target:
        state["message"] = "Elegí dos torres distintas."
        return state, None, 0, state["message"]
    towers = state["towers"]
    if not towers[source]:
        state["message"] = "La torre origen está vacía."
        return state, None, 0, state["message"]
    disk = towers[source][0]
    if towers[target] and towers[target][0] < disk:
        state["message"] = "Movimiento inválido: no podés poner un disco grande sobre uno chico."
        return state, None, 0, state["message"]
    towers[source].pop(0)
    towers[target].insert(0, disk)
    state["moves"] += 1
    state["message"] = f"Moviste un disco de torre {source + 1} a torre {target + 1}."
    if len(towers[2]) == state["n"]:
        minimum = 2 ** state["n"] - 1
        if state["moves"] <= minimum:
            state["status"] = "won"
            return state, "won", state["moves"], f"Ganaste en {state['moves']} movimientos. Mínimo: {minimum}."
        state["status"] = "lost"
        return state, "lost", state["moves"], f"Completaste, pero superaste el mínimo: {state['moves']} vs {minimum}."
    return state, None, 0, state["message"]
