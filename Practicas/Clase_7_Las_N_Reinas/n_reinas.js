const nInput = document.getElementById("n");
const solveBtn = document.getElementById("solveBtn");
const nextBtn = document.getElementById("nextBtn");
const processBoard = document.getElementById("processBoard");
const solutionBoard = document.getElementById("solutionBoard");
const message = document.getElementById("message");
const indexes = document.getElementById("indexes");

let soluciones = []; //Guardamos las soluciones encontradas para el valor ingresado
let pasosProceso = []; //Guardamos los pasos para los pasos del primer recorrido y así mostrar el proceso visualmente 
let solucionActual = 0; 

//Conectamos los botones con las funciones principales del programa 
solveBtn.addEventListener("click", resolver);
nextBtn.addEventListener("click", siguienteSolucion);

//Validamos el valor ingresado, busca soluciones y actualiza la pantalla 
function resolver() {
    const n = parseInt(nInput.value);

    if (isNaN(n) || n < 8) {
        message.textContent = "Error: el valor de N debe ser igual o mayor a 8.";
        limpiar();
        return;
    }
//Reiniciamos los datos para que con una nueva ejecución no se mezclen con los resultados anteriores
    soluciones = [];
    pasosProceso = [];
    solucionActual = 0;
//Representamos el tablero con un arreglo donde cada posición es una fila
    const tablero = new Array(n).fill(-1);

    buscarSoluciones(tablero, 0, n);

//Sí no encuentro ninguna solución, limpia pantalla y avisa al usuario 
    if (soluciones.length === 0) {
        message.textContent = "No se encontraron soluciones.";
        limpiar();
        return;
    }

    message.textContent = `Se encontraron ${soluciones.length} soluciones. Mostrando solución 1 de ${soluciones.length}.`;

    
    nextBtn.disabled = soluciones.length <= 1;//Habilitamos el botón siguiente solo si hay más de una solución disponible.

//Mostramos el proceso y la primera solución encontrada
    animarProceso(n);
    mostrarSolucion();
}


function buscarSoluciones(tablero, fila, n) {
    if (fila === n) { //Si se completaron todas las filas, se encontró una solucion.
        soluciones.push([...tablero]);
        return;
    }
//Probamos colocar una reina en cada columna de la fila actual.
    for (let columna = 0; columna < n; columna++) {
        if (esSeguro(tablero, fila, columna)) { //Solo avanzamos si la posición no es atacada por otra reina
            tablero[fila] = columna;

            if (soluciones.length === 0) {
                pasosProceso.push([...tablero]);
            }

            buscarSoluciones(tablero, fila + 1, n);

            tablero[fila] = -1;
        }
    }
}

//Verificamos si una reina puede colocarse sin compartir columna ni diagonal.
function esSeguro(tablero, filaActual, columnaActual) {
    for (let filaAnterior = 0; filaAnterior < filaActual; filaAnterior++) {
        const columnaAnterior = tablero[filaAnterior];

        const mismaColumna = columnaAnterior === columnaActual; //Comprobamos si hay otra reina en la misma columna

        const mismaDiagonal =
            Math.abs(filaActual - filaAnterior) ===
            Math.abs(columnaActual - columnaAnterior);

        if (mismaColumna || mismaDiagonal) {
            return false;
        }
    }

    return true;
}

//Mostramos en pantalla la solución actual y su arreglo de indices
function mostrarSolucion() {
    const n = parseInt(nInput.value);
    const solucion = soluciones[solucionActual];

    dibujarTablero(solutionBoard, solucion, n); //Dibujo del tablero final con las reinas ubicadas

    indexes.textContent = "[" + solucion.join(", ") + "]";

    message.textContent =
        `Mostrando solución ${solucionActual + 1} de ${soluciones.length}`;
}

//Avanza a la siguiente solución y vuelve a la primera al llegar al final
function siguienteSolucion() {
    solucionActual++;

    if (solucionActual >= soluciones.length) {
        solucionActual = 0;
    }

    mostrarSolucion();
}

//Reproducimos visualmente los pasos guardados durante la búsqueda inicial
function animarProceso(n) {
    let paso = 0;

    const intervalo = setInterval(() => { //Colocamos un uso de intervalo para que el proceso no aparezca todo de golpe
        if (paso >= pasosProceso.length) {
            clearInterval(intervalo);
            return;
        }

        dibujarTablero(processBoard, pasosProceso[paso], n);
        paso++;
    }, 250);
}

//Dibujamos dinamicamente un tablero de tamaño N x N dentro del contenedor recibido.
function dibujarTablero(contenedor, arreglo, n) {
    contenedor.innerHTML = "";

    let tamanioCelda = 46;

    if (n > 10) {
        tamanioCelda = 34;
    }

    if (n > 14) {
        tamanioCelda = 26;
    }

//Definimos la cantidad de filas y columnas del tablero.
    contenedor.style.gridTemplateColumns = `repeat(${n}, ${tamanioCelda}px)`;
    contenedor.style.gridTemplateRows = `repeat(${n}, ${tamanioCelda}px)`;

//Recorremos cada posición del tablero para crear sus celdas
    for (let fila = 0; fila < n; fila++) {
        for (let columna = 0; columna < n; columna++) {
            const celda = document.createElement("div");

            celda.classList.add("cell");

            celda.style.width = tamanioCelda + "px";
            celda.style.height = tamanioCelda + "px";

            if ((fila + columna) % 2 === 0) {
                celda.classList.add("white");
            } else {
                celda.classList.add("black");
            }

            if (arreglo[fila] === columna) {
                celda.textContent = "♛";
                celda.classList.add("queen");
            }

            contenedor.appendChild(celda);
        }
    }
}

//Limpia los tableros y desactiva el botón de siguiente solución.
function limpiar() {
    processBoard.innerHTML = "";
    solutionBoard.innerHTML = "";
    indexes.textContent = "[]";
    nextBtn.disabled = true;
}