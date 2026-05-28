let vidasJugador = 3;
let vidasEnemigo = 3;

function iniciarJuego() {
  let botonPersonajeJugador = document.getElementById("boton-personaje");

  botonPersonajeJugador.addEventListener("click", seleccionarPersonajeJugador);
}

function seleccionarPersonajeJugador() {
  let inputZuko = document.getElementById("zuko");
  let inputKatara = document.getElementById("katara");
  let inputAang = document.getElementById("aang");
  let inputToph = document.getElementById("toph");

  let spanPersonajeJugador = document.getElementById("personaje-jugador");

  if (inputZuko.checked) {
    spanPersonajeJugador.innerHTML = "Zuko";
  } else if (inputKatara.checked) {
    spanPersonajeJugador.innerHTML = "Katara";
  } else if (inputAang.checked) {
    spanPersonajeJugador.innerHTML = "Aang";
  } else if (inputToph.checked) {
    spanPersonajeJugador.innerHTML = "Toph";
  } else {
    alert("Selecciona un personaje");
    return;
  }

  seleccionarPersonajeEnemigo();
}

function seleccionarPersonajeEnemigo() {
  let personajeAleatorio = aleatoria(1, 4);

  let spanPersonajeEnemigo = document.getElementById("personaje-enemigo");

  if (personajeAleatorio == 1) {
    spanPersonajeEnemigo.innerHTML = "Zuko";
  } else if (personajeAleatorio == 2) {
    spanPersonajeEnemigo.innerHTML = "Katara";
  } else if (personajeAleatorio == 3) {
    spanPersonajeEnemigo.innerHTML = "Aang";
  } else {
    spanPersonajeEnemigo.innerHTML = "Toph";
  }

  mostrarVidas();
}

function mostrarVidas() {
  let spanVidasJugador = document.getElementById("vidas-jugador");

  let spanVidasEnemigo = document.getElementById("vidas-enemigo");

  spanVidasJugador.innerHTML = vidasJugador;
  spanVidasEnemigo.innerHTML = vidasEnemigo;
}

function aleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);
