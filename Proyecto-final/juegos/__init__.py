from .ahorcado import action as action_ahorcado
from .ahorcado import public_state as public_ahorcado
from .ahorcado import start as start_ahorcado
from .auto import action as action_auto
from .auto import public_state as public_auto
from .auto import start as start_auto
from .hanoi import action as action_hanoi
from .hanoi import public_state as public_hanoi
from .hanoi import start as start_hanoi
from .memoria import action as action_memoria
from .memoria import public_state as public_memoria
from .memoria import start as start_memoria
from .penales import action as action_penales
from .penales import public_state as public_penales
from .penales import start as start_penales
from .piedra_papel_tijera import action as action_rps
from .piedra_papel_tijera import public_state as public_rps
from .piedra_papel_tijera import start as start_rps


GAMES = {
    "ahorcado": "Ahorcado",
    "auto": "Auto con obstáculos",
    "piedra-papel-tijera": "Piedra, papel o tijera",
    "penales": "Penales",
    "hanoi": "Torres de Hanoi",
    "memoria": "Juego de memoria",
}

STARTERS = {
    "ahorcado": lambda data: start_ahorcado(),
    "auto": lambda data: start_auto(),
    "piedra-papel-tijera": lambda data: start_rps(),
    "penales": lambda data: start_penales(),
    "hanoi": lambda data: start_hanoi(int(data.get("n", 3))),
    "memoria": lambda data: start_memoria(),
}

ACTIONS = {
    "ahorcado": action_ahorcado,
    "auto": action_auto,
    "piedra-papel-tijera": action_rps,
    "penales": action_penales,
    "hanoi": action_hanoi,
    "memoria": action_memoria,
}

PUBLIC = {
    "ahorcado": public_ahorcado,
    "auto": public_auto,
    "piedra-papel-tijera": public_rps,
    "penales": public_penales,
    "hanoi": public_hanoi,
    "memoria": public_memoria,
}
