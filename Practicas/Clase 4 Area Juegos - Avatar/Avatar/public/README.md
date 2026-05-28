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
  * Vidas de ambos personajes.

### Sistema de vidas

* Inicialización de variables globales:

  * `vidasJugador`
  * `vidasEnemigo`
* Renderizado dinámico de vidas mediante spans con identificadores únicos.

### Eventos

* Inicialización automática del juego usando:

```javascript
window.addEventListener('load', iniciarJuego)
```

---

## Estructura del proyecto

```plaintext
📁 proyecto-avatar
│
├── index.html
└── js
    └── avatar.js
```
