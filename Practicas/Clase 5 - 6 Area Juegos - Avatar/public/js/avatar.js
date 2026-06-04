let ataqueJugador;
let ataqueEnemigo;

function iniciarJuego() {
  document.getElementById("reglas").style.display = "none";

  let botonReglas = document.getElementById("boton-reglas");
  botonReglas.addEventListener("click", alternarReglas);

  let botonPersonajeJugador = document.getElementById("boton-personaje");
  botonPersonajeJugador.addEventListener("click", seleccionarPersonajeJugador);

  let botonPunio = document.getElementById("boton-punio");
  botonPunio.addEventListener("click", ataquePunio);

  let botonPatada = document.getElementById("boton-patada");
  botonPatada.addEventListener("click", ataquePatada);

  let botonBarrida = document.getElementById("boton-barrida");
  botonBarrida.addEventListener("click", ataqueBarrida);
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
    alert("Por favor, selecciona un personaje primero.");
    return;
  }

  seleccionarPersonajeEnemigo();
}

function seleccionarPersonajeEnemigo() {
  let personajeAleatorio = aleatoria(1, 4);

  let spanPersonajeEnemigo = document.getElementById("personaje-enemigo");

  if (personajeAleatorio === 1) {
    spanPersonajeEnemigo.innerHTML = "Zuko";
  } else if (personajeAleatorio === 2) {
    spanPersonajeEnemigo.innerHTML = "Katara";
  } else if (personajeAleatorio === 3) {
    spanPersonajeEnemigo.innerHTML = "Aang";
  } else {
    spanPersonajeEnemigo.innerHTML = "Toph";
  }
}

function ataquePunio() {
  ataqueJugador = "Punio";
  ataqueAleatorioEnemigo();
}

function ataquePatada() {
  ataqueJugador = "Patada";
  ataqueAleatorioEnemigo();
}

function ataqueBarrida() {
  ataqueJugador = "Barrida";
  ataqueAleatorioEnemigo();
}

function ataqueAleatorioEnemigo() {
  let ataqueAleatorio = aleatoria(1, 3);

  if (ataqueAleatorio === 1) {
    ataqueEnemigo = "Punio";
  } else if (ataqueAleatorio === 2) {
    ataqueEnemigo = "Patada";
  } else {
    ataqueEnemigo = "Barrida";
  }

  combate();
}

function combate() {
  if (ataqueJugador === ataqueEnemigo) {
    crearMensaje("EMPATE");
  } else if (ataqueJugador === "Punio" && ataqueEnemigo === "Barrida") {
    crearMensaje("GANASTE");
  } else if (ataqueJugador === "Patada" && ataqueEnemigo === "Punio") {
    crearMensaje("GANASTE");
  } else if (ataqueJugador === "Barrida" && ataqueEnemigo === "Patada") {
    crearMensaje("GANASTE");
  } else {
    crearMensaje("PERDISTE");
  }
}

function crearMensaje(resultado) {
  let sectionMensaje = document.getElementById("mensajes");

  let parrafo = document.createElement("p");

  parrafo.innerHTML =
    "Tu personaje atacó con " +
    ataqueJugador +
    ", el personaje enemigo atacó con " +
    ataqueEnemigo +
    ". " +
    resultado;

  sectionMensaje.appendChild(parrafo);
}

function alternarReglas() {
  let reglas = document.getElementById("reglas");
  let boton = document.getElementById("boton-reglas");

  if (reglas.style.display === "none") {
    reglas.style.display = "block";
    boton.innerHTML = "📜 Ocultar reglas";
  } else {
    reglas.style.display = "none";
    boton.innerHTML = "📜 Mostrar reglas";
  }
}

function aleatoria(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);
