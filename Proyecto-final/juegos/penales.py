import random
from typing import Any

from api_error import ApiError

#Devuelve el nombre del lado elegido. 
def lane_name(lane: int) -> str:
    return {1: "Izquierda", 2: "Centro", 3: "Derecha"}[lane]

#Devuelve el estado que verá el frontend.
def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "status": state["status"],
        "goals": state.get("goals", 0),
        "saves": state.get("saves", 0),
        "last": state.get("last"),
        "message": state.get("message", "Elegí dónde patear."),
    }

#Inicializa nueva partida, con estado activo, goles y atajadas en 0 y mensaje inicial.
def start() -> dict[str, Any]:
    return {
        "status": "active", "goals": 0, "saves": 0,
        "message": "Objetivo: anotar 7 goles antes de que el arquero ataje 3.",
    }

# Procesa cada penal pateado por el jugador.
def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    #Si la partida no está activa, no se puede jugar más.
    if state["status"] != "active":
        return state, None, 0, "La partida ya terminó."
    #Intenta leer y valida la dirección elegida.
    try:
        shot = int(data.get("shot"))
    except Exception:
        raise ApiError("Elegí 1, 2 o 3.")
    if shot not in {1, 2, 3}:
        raise ApiError("Elegí 1=Izq, 2=Centro o 3=Der.")
    #La CPU elige aleatoriamente un lado para el arquero.
    keeper = random.randint(1, 3)
    #Si son iguales, es atajada, si no, es gol.
    saved = shot == keeper
    #Actualiza el estado según el resultado.
    if saved:
        state["saves"] += 1
        message = "¡ATAJADA!"
    else:
        state["goals"] += 1
        message = "¡GOOOOL!"
    #Guarda la última jugada
    state["last"] = {"shot": lane_name(shot), "keeper": lane_name(keeper), "saved": saved}
    state["message"] = message
    #Si llega a 7 goles, gana.
    if state["goals"] >= 7:
        state["status"] = "won"
        return state, "won", state["goals"], "Ganaste la tanda de penales."
    #Si el arquero ataja 3, pierde.
    if state["saves"] >= 3:
        state["status"] = "lost"
        return state, "lost", state["goals"], "Perdiste: el arquero atajó 3."
    #Si no terminó, continúa la tanda de penales.
    return state, None, 0, message
