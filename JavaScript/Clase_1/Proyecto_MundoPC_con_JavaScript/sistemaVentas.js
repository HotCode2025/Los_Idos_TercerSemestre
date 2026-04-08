// ============================================
// CLASE DISPOSITIVOENTRADA (BASE)
// ============================================
class DispositivoEntrada {
    constructor(tipoEntrada, marca) {
        this._tipoEntrada = tipoEntrada;
        this._marca = marca;
    }

    // Getters y Setters
    get tipoEntrada() {
        return this._tipoEntrada;
    }

    set tipoEntrada(tipoEntrada) {
        this._tipoEntrada = tipoEntrada;
    }

    get marca() {
        return this._marca;
    }

    set marca(marca) {
        this._marca = marca;
    }

    toString() {
        return `Tipo: ${this._tipoEntrada}, Marca: ${this._marca}`;
    }

    // Responsabilidad: Crear objetos de tipo DispositivoEntrada
}

// ============================================
// CLASE TECLADO (HEREDA DE DISPOSITIVOENTRADA)
// ============================================
class Teclado extends DispositivoEntrada {
    static contadorTeclados = 0;

    constructor(marca) {
        super("Teclado", marca); // tipoEntrada fijo como "Teclado"
        this._idTeclado = ++Teclado.contadorTeclados;
    }

    get idTeclado() {
        return this._idTeclado;
    }

    toString() {
        return `Teclado [ID: ${this._idTeclado}, ${super.toString()}]`;
    }

    // Responsabilidad: Crear objetos de tipo Teclado
}

// ============================================
// CLASE RATON (HEREDA DE DISPOSITIVOENTRADA)
// ============================================
class Raton extends DispositivoEntrada {
    static contadorRatones = 0;

    constructor(marca) {
        super("Ratón", marca); // tipoEntrada fijo como "Ratón"
        this._idRaton = ++Raton.contadorRatones;
    }

    get idRaton() {
        return this._idRaton;
    }

    toString() {
        return `Ratón [ID: ${this._idRaton}, ${super.toString()}]`;
    }

    // Responsabilidad: Crear objetos de tipo Raton
}

// ============================================
// CLASE MONITOR
// ============================================
class Monitor {
    static contadorMonitores = 0;

    constructor(marca, tamaño) {
        this._idMonitor = ++Monitor.contadorMonitores;
        this._marca = marca;
        this._tamaño = tamaño;
    }

    get idMonitor() {
        return this._idMonitor;
    }

    toString() {
        return `Monitor [ID: ${this._idMonitor}, Marca: ${this._marca}, Tamaño: ${this._tamaño}]`;
    }
}

// ============================================
// CLASE COMPUTADORA
// ============================================
class Computadora {
    static contadorComputadoras = 0;

    constructor(nombre, monitor, teclado, raton) {
        this._idComputadora = ++Computadora.contadorComputadoras;
        this._nombre = nombre;
        this._monitor = monitor;
        this._teclado = teclado;
        this._raton = raton;
    }

    get idComputadora() {
        return this._idComputadora;
    }

    toString() {
        return `Computadora [ID: ${this._idComputadora}, Nombre: ${this._nombre}, ` +
               `${this._monitor.toString()}, ${this._teclado.toString()}, ${this._raton.toString()}]`;
    }
}

// ============================================
// CLASE ORDEN
// ============================================
class Orden {
    static contadorOrdenes = 0;

    constructor() {
        this._idOrden = ++Orden.contadorOrdenes;
        this._computadoras = [];
    }

    get idOrden() {
        return this._idOrden;
    }

    agregarComputadora(computadora) {
        if (computadora instanceof Computadora) {
            this._computadoras.push(computadora);
        } else {
            console.error("Error: Solo se pueden agregar objetos de tipo Computadora.");
        }
    }

    mostrarOrden() {
        console.log(`=== ORDEN #${this._idOrden} ===`);
        console.log(`Total de computadoras: ${this._computadoras.length}`);
        this._computadoras.forEach((comp, index) => {
            console.log(`  ${index + 1}. ${comp.toString()}`);
        });
        console.log("=============================");
    }
}

// ============================================
// PRUEBAS ACTUALIZADAS (con marcas para teclado y ratón)
// ============================================
console.log("=== PRUEBA DE MONITOR ===");
const monitor1 = new Monitor("Samsung", "24 pulgadas");
const monitor2 = new Monitor("LG", "27 pulgadas");
console.log(monitor1.toString());
console.log(monitor2.toString());
console.log("ID del monitor1 usando getter:", monitor1.idMonitor);
console.log("-----------------------------------\n");

console.log("=== PRUEBA DE TECLADO ===");
const teclado1 = new Teclado("Logitech");
const teclado2 = new Teclado("Corsair");
console.log(teclado1.toString());
console.log(teclado2.toString());
console.log("-----------------------------------\n");

console.log("=== PRUEBA DE RATÓN ===");
const raton1 = new Raton("Razer");
const raton2 = new Raton("HP");
console.log(raton1.toString());
console.log(raton2.toString());
console.log("-----------------------------------\n");

console.log("=== PRUEBA DE COMPUTADORA ===");
const pc1 = new Computadora("PC Gamer", monitor1, teclado1, raton1);
const pc2 = new Computadora("PC Oficina", monitor2, teclado2, raton2);
console.log(pc1.toString());
console.log(pc2.toString());
console.log("-----------------------------------\n");

console.log("=== PRUEBA DE ORDEN Y FUNCIONALIDAD COMPLETA ===");
const orden1 = new Orden();
orden1.agregarComputadora(pc1);
orden1.agregarComputadora(pc2);
orden1.mostrarOrden();

const monitor3 = new Monitor("Dell", "21.5 pulgadas");
const teclado3 = new Teclado("Microsoft");
const raton3 = new Raton("Logitech");
const pc3 = new Computadora("PC Multimedia", monitor3, teclado3, raton3);

const orden2 = new Orden();
orden2.agregarComputadora(pc3);
orden2.mostrarOrden();

console.log("\n=== VERIFICACIÓN DE IDS AUTOMÁTICOS ===");
console.log(`Total monitores creados: ${Monitor.contadorMonitores}`);
console.log(`Total teclados creados: ${Teclado.contadorTeclados}`);
console.log(`Total ratones creados: ${Raton.contadorRatones}`);
console.log(`Total computadoras creadas: ${Computadora.contadorComputadoras}`);
console.log(`Total órdenes creadas: ${Orden.contadorOrdenes}`);