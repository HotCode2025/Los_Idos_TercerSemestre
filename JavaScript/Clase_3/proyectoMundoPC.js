// ============================================
// CLASE DISPOSITIVOENTRADA (BASE)
// ============================================
class DispositivoEntrada {
    constructor(tipoEntrada, marca) {
        this._tipoEntrada = tipoEntrada;
        this._marca = marca;
    }

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

    // POLIMORFISMO
    descripcion() {
        return `Dispositivo: ${this._tipoEntrada} - Marca: ${this._marca}`;
    }
}

// ============================================
// CLASE TECLADO
// ============================================
class Teclado extends DispositivoEntrada {
    static contadorTeclados = 0;

    constructor(marca) {
        super("Teclado", marca);
        this._idTeclado = ++Teclado.contadorTeclados;
    }

    get idTeclado() {
        return this._idTeclado;
    }

    toString() {
        return `Teclado [ID: ${this._idTeclado}, ${super.toString()}]`;
    }

    // POLIMORFISMO
    descripcion() {
        return `Teclado ID ${this._idTeclado} (${this._marca})`;
    }
}

// ============================================
// CLASE RATON
// ============================================
class Raton extends DispositivoEntrada {
    static contadorRatones = 0;

    constructor(marca) {
        super("Ratón", marca);
        this._idRaton = ++Raton.contadorRatones;
    }

    get idRaton() {
        return this._idRaton;
    }

    toString() {
        return `Ratón [ID: ${this._idRaton}, ${super.toString()}]`;
    }

    // POLIMORFISMO
    descripcion() {
        return `Ratón ID ${this._idRaton} (${this._marca})`;
    }
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

    // POLIMORFISMO
    descripcion() {
        return `Monitor ${this._marca} de ${this._tamaño}`;
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

    // POLIMORFISMO
    descripcion() {
        return `Computadora ${this._nombre} con:
    - ${this._monitor.descripcion()}
    - ${this._teclado.descripcion()}
    - ${this._raton.descripcion()}`;
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

    // USO DE POLIMORFISMO
    mostrarOrden() {
        console.log(`=== ORDEN #${this._idOrden} ===`);
        console.log(`Total de computadoras: ${this._computadoras.length}`);
        this._computadoras.forEach((comp, index) => {
            console.log(`  ${index + 1}. ${comp.descripcion()}`);
        });
        console.log("=============================");
    }
}

// ============================================
// PRUEBAS
// ============================================

const monitor1 = new Monitor("Samsung", "24 pulgadas");
const monitor2 = new Monitor("LG", "27 pulgadas");

const teclado1 = new Teclado("Logitech");
const teclado2 = new Teclado("Corsair");

const raton1 = new Raton("Razer");
const raton2 = new Raton("HP");

const pc1 = new Computadora("PC Gamer", monitor1, teclado1, raton1);
const pc2 = new Computadora("PC Oficina", monitor2, teclado2, raton2);

const orden1 = new Orden();
orden1.agregarComputadora(pc1);
orden1.agregarComputadora(pc2);
orden1.mostrarOrden();

// Se aplicó polimorfismo mediante el método descripcion(), 
// el cual es implementado de forma diferente en cada clase (Teclado, Ratón, Monitor y Computadora). 
// La clase Orden utiliza este método sin conocer el tipo específico del objeto, logrando un comportamiento dinámico y flexible.