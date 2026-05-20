const inputN = document.getElementById("n");
const btnResolver = document.getElementById("btnResolver");
const btnSiguiente = document.getElementById("btnSiguiente");
const tableroProceso = document.getElementById("tableroProceso");
const tableroSolucion = document.getElementById("tableroSolucion");
const mensaje = document.getElementById("mensaje");
const arregloHTML = document.getElementById("arreglo");

let soluciones = [];
let pasosSoluciones = [];
let solucionActual = 0;
let pasoActual = 0;
let animacion = null;
let limiteSoluciones = 0;

// Botones principales del programa
btnResolver.addEventListener("click", resolver);
btnSiguiente.addEventListener("click", mostrarSiguiente);

function resolver() {
    let valor = inputN.value.trim();
    let n = Number(valor);
    limiteSoluciones = n >= 14 ? 5 : Infinity;

    // Validamos que sea numero, entero y mayor o igual a 8
    if (
        valor === "" ||
        isNaN(n) ||
        !Number.isInteger(n) ||
        n < 8
    ) {
        mensaje.innerHTML =
            "Error: debe ingresar un número entero mayor o igual a 8.";

        limpiar();
        return;
    }

    // Reiniciamos los datos antes de buscar nuevas soluciones
    soluciones = [];
    pasosSoluciones = [];
    solucionActual = 0;

    //El arreglo representa el tablero: indice = fila, valor = columna
    // El -1 para indica que no hay reinas
    let tablero = new Array(n).fill(-1);

    // Empezamos a buscar soluciones desde la fila 0.
    buscarSoluciones(tablero, 0, n);

    if (soluciones.length === 0) {
        mensaje.innerHTML = "No se encontraron soluciones.";
        limpiar();
        return;
    }

    mensaje.innerHTML = "Se encontraron " + soluciones.length + " soluciones.";

    btnSiguiente.disabled = soluciones.length <= 1;

    mostrarProceso(n);
    mostrarSolucion();
}

function buscarSoluciones(tablero, fila, n, pasosActuales = []) {
    if (soluciones.length >= limiteSoluciones) {
        return;
    }

    // Si fila es igual a n, significa que colocamos todas las reinas correspondientes 
    if (fila === n) {
        soluciones.push([...tablero]);
        pasosSoluciones.push([...pasosActuales]);
        return;
    }

    // Revisamos cada columna de la fila actual para ver si es seguro poner una reina
    for (let columna = 0; columna < n; columna++) {
        if (esSeguro(tablero, fila, columna)) {
            tablero[fila] = columna;

            pasosActuales.push([...tablero]);

            // Busca en la siguiente fila
            buscarSoluciones(tablero, fila + 1, n, pasosActuales);

            pasosActuales.pop();
            tablero[fila] = -1;
        }
    }
}

function esSeguro(tablero, fila, columna) {
    for (let i = 0; i < fila; i++) {
        let columnaAnterior = tablero[i];

        //no puede haber dos reinas en la misma columna
        if (columnaAnterior === columna) {
            return false;
        }

        // tampoco puede haber dos reinas en la misma diagonal
        if (Math.abs(fila - i) === Math.abs(columna - columnaAnterior)) {
            return false;
        }
    }

    return true;
}

function mostrarProceso(n) {
    pasoActual = 0;

    if (animacion !== null) {
        clearInterval(animacion);
    }

    let pasos = pasosSoluciones[solucionActual];

    dibujarTablero(tableroProceso, pasos[pasoActual], n);

    animacion = setInterval(() => {
        pasoActual++;

        if (pasoActual >= pasos.length) {
            clearInterval(animacion);
            animacion = null;
            return;
        }

        dibujarTablero(tableroProceso, pasos[pasoActual], n);
    }, 700);
}

function mostrarSolucion() {
    let n = parseInt(inputN.value);
    let solucion = soluciones[solucionActual];

    dibujarTablero(tableroSolucion, solucion, n);
    let indices = [];

    for (let fila = 0; fila < solucion.length; fila++) {
        indices.push(
            "(" + (fila + 1) + ", " + (solucion[fila] + 1) + ")"
        );
    }

    arregloHTML.innerHTML = "[" + indices.join(", ") + "]";

    if (n >= 14) {
        mensaje.innerHTML =
            "Se mostrarán solo las primeras 5 soluciones por rendimiento.<br>" +
            "Mostrando solución " +
            (solucionActual + 1) +
            " de " +
            soluciones.length;
    } else {
        mensaje.innerHTML =
            "Mostrando solución " + (solucionActual + 1) + " de " + soluciones.length;

    }
    mostrarProceso(n);
}

function mostrarSiguiente() {
    solucionActual++;

    if (solucionActual >= soluciones.length) {
        solucionActual = 0;
    }

    mostrarSolucion();
}

function dibujarTablero(contenedor, arreglo, n) {
    contenedor.innerHTML = "";

    contenedor.style.gridTemplateColumns = "repeat(" + n + ", 45px)";

    for (let fila = 0; fila < n; fila++) {
        for (let columna = 0; columna < n; columna++) {
            let casilla = document.createElement("div");

            casilla.classList.add("casilla");

            if ((fila + columna) % 2 === 0) {
                casilla.classList.add("blanca");
            } else {
                casilla.classList.add("negra");
            }

            if (arreglo[fila] === columna) {
                casilla.innerHTML = "♛";
                casilla.classList.add("reina");
            }

            contenedor.appendChild(casilla);
        }
    }
}

function limpiar() {
    tableroProceso.innerHTML = "";
    tableroSolucion.innerHTML = "";
    arregloHTML.innerHTML = "[]";
    btnSiguiente.disabled = true;

    if (animacion !== null) {
        clearInterval(animacion);
        animacion = null;
    }
}