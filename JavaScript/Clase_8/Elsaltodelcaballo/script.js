// =====================================================
//   TOUR DEL CABALLO — Algoritmo de vuelta atrás
// =====================================================

const N = 8; // Tamaño del tablero (8x8 = 64 casillas)

// Los 8 movimientos posibles del caballo
const movimientos = [
  [ 2,  1], [ 1,  2], [-1,  2], [-2,  1],
  [-2, -1], [-1, -2], [ 1, -2], [ 2, -1]
];

let tablero = [];       // Guarda el número de salto de cada casilla (-1 = libre)
let celdas  = [];       // Array 2D con los elementos HTML del tablero
let inicioX = -1;       // Fila de inicio elegida por el usuario
let inicioY = -1;       // Columna de inicio elegida por el usuario
let animando    = false;
let intervaloAnim = null;

// Calcula el retardo de la animación según el slider
// (slider en máximo = velocidad alta = retardo bajo)
function retardo() {
  return 550 - parseInt(document.getElementById('speed').value);
}

// =====================================================
//   CREAR EL TABLERO EN PANTALLA
// =====================================================
function crearTablero() {
  const divTablero = document.getElementById('tablero');
  divTablero.innerHTML = '';
  celdas  = [];
  tablero = Array.from({length: N}, () => new Array(N).fill(-1));

  for (let f = 0; f < N; f++) {
    celdas.push([]);
    for (let c = 0; c < N; c++) {
      const celda = document.createElement('div');
      // Alterna colores: clara si la suma fila+columna es par, oscura si es impar
      celda.className = 'celda ' + ((f + c) % 2 === 0 ? 'clara' : 'oscura');
      celda.dataset.f = f;
      celda.dataset.c = c;
      celda.addEventListener('click', elegirInicio);
      divTablero.appendChild(celda);
      celdas[f].push(celda);
    }
  }
}

// =====================================================
//   EL USUARIO ELIGE LA CASILLA DE INICIO
// =====================================================
function elegirInicio(e) {
  if (animando) return; // No permite cambiar inicio mientras anima

  // Borra la selección anterior si había una
  if (inicioX !== -1) {
    celdas[inicioX][inicioY].classList.remove('inicio');
    celdas[inicioX][inicioY].innerHTML = '';
  }

  inicioX = parseInt(e.currentTarget.dataset.f);
  inicioY = parseInt(e.currentTarget.dataset.c);

  // Marca la casilla elegida con el caballo
  celdas[inicioX][inicioY].classList.add('inicio');
  celdas[inicioX][inicioY].innerHTML = '♞';

  document.getElementById('btnResolver').disabled = false;
  document.getElementById('estado').textContent = `📍 Inicio en fila ${inicioX}, columna ${inicioY}`;
  document.getElementById('contador').textContent = 'Salto 0 / 63';
}

// =====================================================
//   FUNCIONES DEL ALGORITMO
// =====================================================

// Verifica que la casilla esté dentro del tablero y no haya sido visitada
function esValido(x, y) {
  return x >= 0 && y >= 0 && x < N && y < N && tablero[x][y] === -1;
}

// Cuenta cuántos movimientos son posibles desde una casilla
// (ordenar por esto ayuda a encontrar la solución mucho más rápido)
function contarOpciones(x, y) {
  let total = 0;
  for (let [dx, dy] of movimientos) {
    if (esValido(x + dx, y + dy)) total++;
  }
  return total;
}

// Algoritmo principal: intenta completar el tour con vuelta atrás
function resolver(x, y, salto) {
  if (salto === N * N) return true; // ¡Visitó las 64 casillas, problema resuelto!

  // Genera todos los movimientos posibles desde la posición actual
  let opciones = [];
  for (let [dx, dy] of movimientos) {
    const nx = x + dx, ny = y + dy;
    if (esValido(nx, ny)) {
      opciones.push({ x: nx, y: ny, opciones: contarOpciones(nx, ny) });
    }
  }

  // Ordena de menor a mayor cantidad de opciones (mejora la búsqueda)
  opciones.sort((a, b) => a.opciones - b.opciones);

  for (let op of opciones) {
    tablero[op.x][op.y] = salto;               // Marca la casilla con el número de salto
    if (resolver(op.x, op.y, salto + 1)) return true;
    tablero[op.x][op.y] = -1;                  // Vuelta atrás: ese camino no funcionó
  }

  return false; // No hay camino posible desde aquí
}

// =====================================================
//   ANIMACIÓN DE LA SOLUCIÓN
// =====================================================
function animarSolucion() {
  // Construye el orden de visita: orden[n] = casilla que se visita en el salto n
  const orden = new Array(N * N);
  for (let f = 0; f < N; f++) {
    for (let c = 0; c < N; c++) {
      orden[tablero[f][c]] = { f, c };
    }
  }

  animando = true;
  document.getElementById('btnResolver').disabled = true;
  let paso = 0;

  intervaloAnim = setInterval(() => {

    // Fin: marca la última casilla y detiene la animación
    if (paso === N * N) {
      const { f, c } = orden[N * N - 1];
      celdas[f][c].classList.remove('actual');
      celdas[f][c].classList.add('visitada');
      celdas[f][c].innerHTML = N * N - 1;

      clearInterval(intervaloAnim);
      animando = false;
      document.getElementById('contador').textContent = 'Salto 63 / 63';
      document.getElementById('estado').textContent = '✅ ¡Tour completado! El caballo visitó las 64 casillas.';
      document.getElementById('btnResolver').disabled = false;
      return;
    }

    // Marca la casilla anterior como visitada y muestra su número de salto
    if (paso > 0) {
      const { f: pf, c: pc } = orden[paso - 1];
      celdas[pf][pc].classList.remove('actual', 'inicio');
      celdas[pf][pc].classList.add('visitada');
      celdas[pf][pc].innerHTML = paso - 1;
    }

    // Coloca el caballo en la casilla del paso actual
    const { f, c } = orden[paso];
    celdas[f][c].classList.remove('inicio');
    celdas[f][c].classList.add('actual');
    celdas[f][c].innerHTML = '♞';

    document.getElementById('contador').textContent = `Salto ${paso} / 63`;
    paso++;

  }, retardo());
}

// =====================================================
//   EVENTOS DE LOS BOTONES
// =====================================================

document.getElementById('btnResolver').addEventListener('click', () => {
  if (inicioX === -1 || animando) return;

  // Limpia cualquier animación anterior del tablero visual
  for (let f = 0; f < N; f++) {
    for (let c = 0; c < N; c++) {
      celdas[f][c].classList.remove('visitada', 'actual', 'inicio');
      celdas[f][c].innerHTML = '';
    }
  }
  // Re-marca la casilla de inicio
  celdas[inicioX][inicioY].classList.add('inicio');
  celdas[inicioX][inicioY].innerHTML = '♞';

  // Reinicia el tablero interno y marca la posición de inicio como salto 0
  tablero = Array.from({length: N}, () => new Array(N).fill(-1));
  tablero[inicioX][inicioY] = 0;

  document.getElementById('estado').textContent = '⏳ Calculando solución...';
  document.getElementById('btnResolver').disabled = true;

  // Pausa breve para que el mensaje aparezca antes de que empiece el cálculo
  setTimeout(() => {
    if (resolver(inicioX, inicioY, 1)) {
      document.getElementById('estado').textContent = '✅ ¡Solución encontrada! Animando el recorrido...';
      animarSolucion();
    } else {
      document.getElementById('estado').textContent = '❌ No se encontró solución desde esta posición.';
      document.getElementById('btnResolver').disabled = false;
    }
  }, 60);
});

document.getElementById('btnReiniciar').addEventListener('click', () => {
  // Detiene la animación si estaba corriendo
  if (intervaloAnim) clearInterval(intervaloAnim);
  animando = false;
  inicioX  = -1;
  inicioY  = -1;
  crearTablero();
  document.getElementById('btnResolver').disabled = true;
  document.getElementById('estado').textContent   = '📍 Elige una casilla para empezar';
  document.getElementById('contador').textContent = 'Salto 0 / 63';
});

// Actualiza la etiqueta de velocidad al mover el slider
document.getElementById('speed').addEventListener('input', (e) => {
  const v = parseInt(e.target.value);
  let etiqueta;
  if      (v <= 100) etiqueta = 'Muy lento';
  else if (v <= 250) etiqueta = 'Normal';
  else if (v <= 400) etiqueta = 'Rápido';
  else               etiqueta = 'Muy rápido';
  document.getElementById('speedLabel').textContent = etiqueta;
});

// =====================================================
//   INICIO DE LA APLICACIÓN
// =====================================================
crearTablero();
