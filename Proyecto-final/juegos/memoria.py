import random
from typing import Any

# Lista de palabras disponibles
# En cada nivel se seleccionará un subconjunto aleatorio
WORDS = [
    "Eclipse", "Montaña", "Relámpago", "Almohada", "Laberinto",
    "Espejo", "Cactus", "Horizonte", "Guitarra", "Reloj",
    "Papel", "Murmullo", "Abismo", "Cometa", "Cosecha",
    "Tinta", "Susurro", "Escalera", "Nube", "Travesía",
    "Cascada", "Sombrero", "Destello", "Caracola", "Amanecer",
    "Ceniza", "Brújula", "Mariposa", "Cristal", "Viento"
]

# Genera una ronda del juego
# Devuelve:
#    - shown: palabras en el orden original que debe memorizar el jugador
#    - shuffled: mismas palabras mezcladas aleatoriamente
def make_round(level: int) -> dict[str, Any]:
    shown = random.sample(WORDS, 5 * level)
    shuffled = shown[:]
    random.shuffle(shuffled)
    return {"shown": shown, "shuffled": shuffled}

# Se genera un public 
# Se utiliza para mostrar información al usuario sin exponer datos innecesarios del estado interno
def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    return {
        "session_id": session_id,
        "status": state["status"],
        "level": state.get("level", 1),
        "shown": state.get("shown", []),
        "shuffled": state.get("shuffled", []),
        "message": state.get("message", "Recordá el orden de las palabras."),
        "correctAnswer": state.get("correctAnswer") if state["status"] in {"failed", "lost", "won"} else None,
    }

# Inicia una nueva partida o un nuevo nivel
def start(level: int = 1) -> dict[str, Any]:
    return {
        "status": "active", "level": level, **make_round(level),
        "message": "Recordá las palabras en orden.",
    }

# Procesa todas las acciones posibles del jugador
def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    requested_action = str(data.get("action", "submit"))
    
    # Si el jugador aprobó un nivel y desea continuar
    if requested_action == "continue" and state["status"] == "passed":
        next_level = state["level"] + 1
        new_state = start(next_level)
        new_state["message"] = f"Nivel {next_level}/4. Recordá el nuevo orden."
        return new_state, None, 0, new_state["message"]
    
    # Si el jugador falló y desea reintentar
    if requested_action == "retry" and state["status"] == "failed":
        new_state = start(state["level"])
        new_state["message"] = f"Reintentá el nivel {state['level']}."
        return new_state, None, 0, new_state["message"]
    
    # El jugador decide finalizar luego de aprobar un nivel
    if requested_action == "finish_after_pass" and state["status"] == "passed":
        state["status"] = "won"
        detail = f"Terminaste el juego de memoria luego de superar el nivel {state['level']}."
        return state, "won", state["level"], detail
    
    # El jugador decide finalizar luego de fallar un nivel
    if requested_action == "finish_after_fail" and state["status"] == "failed":
        state["status"] = "lost"
        detail = f"Finalizaste luego de fallar el nivel {state['level']}."
        return state, "lost", state["level"] - 1, detail
    
    # Si la partida ya terminó, no se aceptan más respuestas
    if state["status"] != "active":
        return state, None, 0, "La partida no está esperando respuesta."

    parts = str(data.get("order", "")).strip().split()
    shown = state["shown"]
    shuffled = state["shuffled"]
    correct = len(parts) == len(shown)
    if correct:
        for index, part in enumerate(parts):
            if not part.isdigit():
                correct = False
                break
            position = int(part)
            if position < 1 or position > len(shuffled) or shuffled[position - 1] != shown[index]:
                correct = False
                break
   
    # Construye automáticamente la respuesta correcta
    # Para cada palabra original busca su posición dentro de la lista mezclada.
    correct_answer = [str(shuffled.index(word) + 1) for word in shown]

    if correct:
        if state["level"] >= 4:
            state["status"] = "won"
            state["message"] = "¡Completaste todos los niveles!"
            return state, "won", 4, "Completaste los 4 niveles del juego de memoria."
        
        # Caso de éxito en niveles intermedios
        state["status"] = "passed"
        state["message"] = f"¡Correcto! Superaste el nivel {state['level']}."
        return state, None, 0, state["message"]

    # Si la respuesta es incorrecta
    state["status"] = "failed"

    # Se guarda la secuencia correcta para mostrarla al jugador
    state["correctAnswer"] = " ".join(correct_answer)
    state["message"] = f"Orden incorrecto. Podés reintentar el nivel {state['level']} o terminar."
    return state, None, 0, state["message"]
