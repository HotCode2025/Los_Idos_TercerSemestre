const inputN = document.getElementById("n");
const btnResolver = document.getElementById("btnResolver");
const btnSiguiente = document.getElementById("btnSiguiente");
const tableroProceso = document.getElementById("tableroProceso");
const tableroSolucion = document.getElementById("tableroSolucion");
const mensaje = document.getElementById("mensaje");
const arregloHTML = document.getElementById("arreglo");

let soluciones = [];
let pasos = [];
let solucionActual = 0;

// Botones principales del programa
btnResolver.addEventListener("click", resolver);
btnSiguiente.addEventListener("click", mostrarSiguiente);

function resolver() {
    let n = parseInt(inputN.value);

    // Validamos que N sea igual o mayor a 8
    if (isNaN(n) || n < 8) {
        mensaje.textContent = "El valor de N debe ser mayor o igual a 8.";
        limpiar();
        return;
    }

    // Reiniciamos los datos antes de buscar nuevas soluciones
    soluciones = [];
    pasos = [];
    solucionActual = 0;

    //El arreglo representa el tablero: indice = fila, valor = columna
    let tablero = new Array(n).fill(-1);

    // Empezamos a buscar soluciones desde la fila 0.
    buscarSoluciones(tablero, 0, n);

    if (soluciones.length === 0) {
        mensaje.textContent = "No se encontraron soluciones.";
        limpiar();
        return;
    }

    mensaje.textContent = "Se encontraron " + soluciones.length + " soluciones.";

    btnSiguiente.disabled = soluciones.length <= 1;

    mostrarProceso(n);
    mostrarSolucion();
}

function buscarSoluciones(tablero, fila, n) {
    // Si llegamos a N, significa que ya pudimos ubicar todas  las reinas
    if (fila === n) {
        soluciones.push([...tablero]);
        return;
    }

    //Probamos una reina en cada columna de la fila actual
    for (let columna = 0; columna < n; columna++) {
        if (esSeguro(tablero, fila, columna)) {
            tablero[fila] = columna;

            // Guardamos algunos pasos del primer recorrido para mostrar el proceso
            if (soluciones.length === 0) {
                pasos.push([...tablero]);
            }

            buscarSoluciones(tablero, fila + 1, n);

            //Sacamos la reina para probar otra columna
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
    //mostramos el último paso guardado del proceso
    let ultimoPaso = pasos[pasos.length - 1];

    dibujarTablero(tableroProceso, ultimoPaso, n);
}

function mostrarSolucion() {
    let n = parseInt(inputN.value);
    let solucion = soluciones[solucionActual];

    dibujarTablero(tableroSolucion, solucion, n);

    arregloHTML.textContent = "[" + solucion.join(", ") + "]";

    mensaje.textContent =
        "Mostrando solución " + (solucionActual + 1) + " de " + soluciones.length;
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
                casilla.textContent = "♛";
                casilla.classList.add("reina");
            }

            contenedor.appendChild(casilla);
        }
    }
}

function limpiar() {
    tableroProceso.innerHTML = "";
    tableroSolucion.innerHTML = "";
    arregloHTML.textContent = "[]";
    btnSiguiente.disabled = true;
}