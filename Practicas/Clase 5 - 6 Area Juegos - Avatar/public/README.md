# AVATAR: LA LEYENDA DE AANG - Juego Web

## Descripción

Juego web interactivo desarrollado con HTML y JavaScript inspirado en la serie animada *Avatar: La Leyenda de Aang*.
El usuario selecciona un personaje y se enfrenta a un enemigo controlado por la PC mediante selección aleatoria.

---

## Tecnologías utilizadas

* HTML5
* JavaScript
* DOM API

---

## Funcionalidades implementadas

### Selección de personaje

* Implementación de botones `radio` para la selección del personaje del jugador.
* Validación de selección antes de iniciar la partida.

### Selección aleatoria del enemigo

* Desarrollo de la función `aleatoria(min, max)` utilizando:

  * `Math.random()`
  * `Math.floor()`
* Asignación automática de un personaje enemigo controlado por la PC.

### Manipulación del DOM

* Uso de:

  * `document.getElementById()`
  * `innerHTML`
  * `addEventListener()`
* Actualización dinámica de:

  * Nombre del jugador.
  * Nombre del enemigo.
  * Mensajes de combate en la sección `#mensajes`.

### Reglas interactivas y resultados

* Se agrega un botón `boton-reglas` para mostrar u ocultar la sección de reglas mediante la función `alternarReglas()`.
* La sección `reglas` contiene las reglas de combate y la relación de ataques (`Punio`, `Patada`, `Barrida`).
* El flujo de combate ahora incluye:

  * selección de ataque del jugador
  * selección aleatoria de ataque del enemigo
  * cálculo del resultado en `combate()`
  * creación de un párrafo dinámico con `crearMensaje(resultado)`

* Los resultados posibles son:

  * `EMPATE`
  * `GANASTE`
  * `PERDISTE`

### Eventos

* Inicialización automática del juego usando:

```javascript
window.addEventListener('load', iniciarJuego)
```



---

## Estructura del proyecto

```plaintext
📁 Avatar/public
│
├── avatar.html
└── js
    └── avatar.js
```
