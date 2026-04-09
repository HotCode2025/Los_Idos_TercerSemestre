
package ar.com.system2026.mundopc;

public class Orden {
    private final int idOrden;
    private Computadora computadora[];
    private static int contadorOrdenes = 0;
    private static final int MAX_COMPUTADORAS =  10;
    private int contadorComputadora;

    // Constructor vacío
    public Orden() {
        this.idOrden = ++contadorOrdenes;
        this.computadora = new Computadora[Orden.MAX_COMPUTADORAS];
    }

    public int getIdOrden() {
        return idOrden;
    }

    public static int getContadorOrdenes() {
        return contadorOrdenes;
    }

    //Método apra agregar una nueva computadora al arreglo
    
    public void agregarComputadora(Computadora computadora) {
        if (contadorComputadora < Orden.MAX_COMPUTADORAS) {
            this.computadora[this.contadorComputadora++] = computadora;
        } else {
            System.err.println("Error: Se ha superado el límite: " + Orden.MAX_COMPUTADORAS);
        }
    }
    
        public void mostrarOrden() {
        System.out.println("ORDEN #" + this.idOrden );
        System.out.println("Computadoras de la Orden #: " + this.idOrden);
        for (int i = 0; i <  this.contadorComputadora; i++) {
            System.out.println(this.computadora[i]);
        }
    }
}
