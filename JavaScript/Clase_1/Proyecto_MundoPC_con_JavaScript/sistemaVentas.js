// ============================================
// CLASE MONITOR
// ============================================
class Monitor {
    // Atributo estático para llevar la cuenta de monitores creados
    static contadorMonitores = 0;

    constructor(marca, tamaño) {
        this._idMonitor = ++Monitor.contadorMonitores; // Asigna ID autoincremental
        this._marca = marca;
        this._tamaño = tamaño;
    }

    // Método getter solicitado para obtener solo el idMonitor
    get idMonitor() {
        return this._idMonitor;
    }

    // Método toString
    toString() {
        return `Monitor [ID: ${this._idMonitor}, Marca: ${this._marca}, Tamaño: ${this._tamaño}]`;
    }

    // Responsabilidad: Crear objetos de tipo Monitor (ya se cumple con el constructor)
}

// Prueba de la clase Monitor
console.log("=== PRUEBA DE MONITOR ===");
const monitor1 = new Monitor("Samsung", "24 pulgadas");
const monitor2 = new Monitor("LG", "27 pulgadas");
console.log(monitor1.toString());
console.log(monitor2.toString());
console.log("ID del monitor1 usando getter:", monitor1.idMonitor);
console.log("-----------------------------------\n");

// ============================================
// CLASE TECLADO
// ============================================
class Teclado {
    static contadorTeclados = 0;

    constructor() {
        this._idTeclado = ++Teclado.contadorTeclados;
    }

    get idTeclado() {
        return this._idTeclado;
    }

    toString() {
        return `Teclado [ID: ${this._idTeclado}]`;
    }

    // Responsabilidad: Crear objetos de tipo Teclado
}

// Prueba de Teclado
console.log("=== PRUEBA DE TECLADO ===");
const teclado1 = new Teclado();
const teclado2 = new Teclado();
console.log(teclado1.toString());
console.log(teclado2.toString());
console.log("-----------------------------------\n");

// ============================================
// CLASE RATON
// ============================================
class Raton {
    static contadorRatones = 0;

    constructor() {
        this._idRaton = ++Raton.contadorRatones;
    }

    get idRaton() {
        return this._idRaton;
    }

    toString() {
        return `Ratón [ID: ${this._idRaton}]`;
    }

    // Responsabilidad: Crear objetos de tipo Raton
}

// Prueba de Raton
console.log("=== PRUEBA DE RATÓN ===");
const raton1 = new Raton();
const raton2 = new Raton();
console.log(raton1.toString());
console.log(raton2.toString());
console.log("-----------------------------------\n");

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

    // Responsabilidad: Crear objetos de tipo Monitor (aunque en este caso la creación la hace Monitor)
    // Aquí simplemente se reciben objetos Monitor ya creados.
}

// Prueba de Computadora
console.log("=== PRUEBA DE COMPUTADORA ===");
const pc1 = new Computadora("PC Gamer", monitor1, teclado1, raton1);
const pc2 = new Computadora("PC Oficina", monitor2, teclado2, raton2);
console.log(pc1.toString());
console.log(pc2.toString());
console.log("-----------------------------------\n");

// ============================================
// CLASE ORDEN
// ============================================
class Orden {
    static contadorOrdenes = 0;

    constructor() {
        this._idOrden = ++Orden.contadorOrdenes;
        this._computadoras = []; // Arreglo de objetos Computadora
    }

    get idOrden() {
        return this._idOrden;
    }

    // Agrega una computadora al arreglo
    agregarComputadora(computadora) {
        if (computadora instanceof Computadora) {
            this._computadoras.push(computadora);
        } else {
            console.error("Error: Solo se pueden agregar objetos de tipo Computadora.");
        }
    }

    // Muestra el contenido completo de la orden
    mostrarOrden() {
        console.log(`=== ORDEN #${this._idOrden} ===`);
        console.log(`Total de computadoras: ${this._computadoras.length}`);
        this._computadoras.forEach((comp, index) => {
            console.log(`  ${index + 1}. ${comp.toString()}`);
        });
        console.log("=============================");
    }

    // Responsabilidades:
    // - Crear objetos de tipo Orden (constructor)
    // - Almacenar un arreglo de objetos de tipo Computadora (arreglo _computadoras)
}

// Prueba de Orden
console.log("=== PRUEBA DE ORDEN Y FUNCIONALIDAD COMPLETA ===");
const orden1 = new Orden();
orden1.agregarComputadora(pc1);
orden1.agregarComputadora(pc2);
orden1.mostrarOrden();

// Crear una tercera computadora con nuevos periféricos
const monitor3 = new Monitor("Dell", "21.5 pulgadas");
const teclado3 = new Teclado();
const raton3 = new Raton();
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