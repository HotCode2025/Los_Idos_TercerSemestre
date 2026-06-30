import random
from typing import Any


WORDS = [                                       #String con todas las palabras predefinidas
    "perro", "gato", "libro", "escuela", "elefante", "mariposa", "dinosaurio",
    "helicoptero", "estrella", "computadora", "camioneta", "esmeralda",
    "catedral", "enciclopedia", "espejo", "telescopio", "refrigerador", "bicicleta", "paracaidas", "astronauta", "murcielago", "cangrejo", "jirafa", "hipopotamo", "cocodrilo", "serpiente", "tortuga", "camaleon", "ornitorrinco"
]

#Funcion que filtra la informacion que se envia al frontend
def public_state(state: dict[str, Any], session_id: int | None = None) -> dict[str, Any]:
    word = state["word"]
    guessed = set(state.get("guessed", []))     #Lista vacia para guardar letras ya usadas
    return {
        "session_id": session_id,
        "status": state["status"],              #Controla el estado de la partida y se divide en 3: active, won o lost
        "masked": " ".join(ch if ch in guessed else "_" for ch in word),
        "used": state.get("guessed", []),
        "errors": state.get("errors", 0),       #Contador de errores (cominza en cero)
        "max_errors": 6,
        "message": state.get("message", ""),    #Guarda el mensaje para el usuario
        "word": word if state["status"] in {"won", "lost"} else None,
    }

#Funcian que inicializa la partida nueva
def start() -> dict[str, Any]:                  
    return {
        "status": "active",                     #Establece el status active
        "word": random.choice(WORDS),           #Elije una palabra de la lista de manera aleatoria
        "guessed": [],                          #Establece en 0 las letras usadas
        "errors": 0,                            #Establece en 0 los errores
        "message": "Ingresá una letra para jugar.", #Primer mensaje de la partida
    }

#Funcion que recibe los datos actuales de l apartida y los datos que envia el usuario
def action(state: dict[str, Any], data: dict[str, Any]) -> tuple[dict[str, Any], str | None, int, str]:
    if state["status"] != "active":             #Valida el estado de la partida
        return state, None, 0, "La partida ya terminó."
    letter = str(data.get("letter", "")).strip().lower()[:1]
    if not letter or not letter.isalpha():      #Verifica que sea una letra valida
        state["message"] = "Ingresá una letra válida."
        return state, None, 0, state["message"]
    if letter in state["guessed"]:              #Verifica que no sea una letra repetida
        state["message"] = f"Ya usaste la letra {letter}."
        return state, None, 0, state["message"]

    state["guessed"].append(letter)             #Si pasa las verificaciones anteriores, agrega la letra al guessed
    if letter not in state["word"]:             #Comprueba que la letra este dentro de la palabra si no aumenta el contador de errores
        state["errors"] += 1
        state["message"] = f"La letra {letter} no está en la palabra."
    else:
        state["message"] = f"Bien: la letra {letter} está en la palabra."

    if all(ch in state["guessed"] for ch in state["word"]):     #Comprueba si todas las letras fueron adivinadas y cambia el status a won
        state["status"] = "won"
        score = max(0, 100 - state["errors"] * 10)
        detail = f"Adivinaste la palabra '{state['word']}' con {state['errors']} errores."
        return state, "won", score, detail
    if state["errors"] >= 6:                                    #Comprueba la cantidad de errores para cambiar el status a lost
        state["status"] = "lost"
        detail = f"Se terminaron los intentos. La palabra era '{state['word']}'."
        return state, "lost", 0, detail
    return state, None, 0, state["message"]
