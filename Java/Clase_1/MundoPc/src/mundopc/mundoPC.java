package mundopc;

import ar.com.system2026.mundopc.*;

public class mundoPC {
    public static void main(String[] args) {
        // Creación de periféricos base
        Monitor monitorHP = new Monitor("HP", 13);
        Teclado tecladoHP = new Teclado("Bluetooth", "HP");
        Raton ratonHP = new Raton("Bluetooth", "HP");
        Computadora computadoraHP = new Computadora("Computadora HP", monitorHP, tecladoHP, ratonHP);
        
        Monitor monitorGamer = new Monitor("Gamer", 17);
        Teclado tecladoGamer = new Teclado("Bluetooth", "Gamer");
        Raton ratonGamer = new Raton("Bluetooth", "Gamer");
        Computadora computadoraGamer = new Computadora("Computadora Gamer", monitorGamer, tecladoGamer, ratonGamer);
        
        // Más computadoras para variedad
        Monitor monitorOficina = new Monitor("Dell", 15);
        Teclado tecladoOficina = new Teclado("USB", "Dell");
        Raton ratonOficina = new Raton("USB", "Dell");
        Computadora computadoraOficina = new Computadora("Computadora Oficina", monitorOficina, tecladoOficina, ratonOficina);
        
        Monitor monitorBasico = new Monitor("Lenovo", 14);
        Teclado tecladoBasico = new Teclado("USB", "Lenovo");
        Raton ratonBasico = new Raton("USB", "Lenovo");
        Computadora computadoraBasica = new Computadora("Computadora Básica", monitorBasico, tecladoBasico, ratonBasico);
        
        Computadora computadorasVarias = new Computadora("Computadora de diferentes marcas", monitorHP, tecladoGamer, ratonHP);
        
        // Crear las 10 órdenes (la 11 va comentada)
        Orden orden1 = new Orden();
        Orden orden2 = new Orden();
        Orden orden3 = new Orden();
        Orden orden4 = new Orden();
        Orden orden5 = new Orden();
        Orden orden6 = new Orden();
        Orden orden7 = new Orden();
        Orden orden8 = new Orden();
        Orden orden9 = new Orden();
        Orden orden10 = new Orden();
        // Orden orden11 = new Orden(); // Comentada por requerimiento (solo 10 órdenes)
        
        // Agregar computadoras a cada orden (flujo completo)
        orden1.agregarComputadora(computadoraHP);
        orden1.agregarComputadora(computadoraGamer);
        
        orden2.agregarComputadora(computadoraOficina);
        orden2.agregarComputadora(computadoraBasica);
        
        orden3.agregarComputadora(computadorasVarias);
        orden3.agregarComputadora(computadoraHP);
        
        orden4.agregarComputadora(computadoraGamer);
        orden4.agregarComputadora(computadoraOficina);
        
        orden5.agregarComputadora(computadoraBasica);
        orden5.agregarComputadora(computadorasVarias);
        
        orden6.agregarComputadora(computadoraHP);
        orden6.agregarComputadora(computadoraBasica);
        
        orden7.agregarComputadora(computadoraGamer);
        orden7.agregarComputadora(computadorasVarias);
        
        orden8.agregarComputadora(computadoraOficina);
        orden8.agregarComputadora(computadoraHP);
        
        orden9.agregarComputadora(computadoraBasica);
        orden9.agregarComputadora(computadoraGamer);
        
        orden10.agregarComputadora(computadorasVarias);
        orden10.agregarComputadora(computadoraOficina);
        
        // Mostrar todas las órdenes
        orden1.mostrarOrden();
        orden2.mostrarOrden();
        orden3.mostrarOrden();
        orden4.mostrarOrden();
        orden5.mostrarOrden();
        orden6.mostrarOrden();
        orden7.mostrarOrden();
        orden8.mostrarOrden();
        orden9.mostrarOrden();
        orden10.mostrarOrden();
        
        // Verificar contadores finales
        System.out.println("\n=== RESUMEN DE CONTADORES ===");
        System.out.println("Total monitores: " + Monitor.getContadorMonitores());
        System.out.println("Total teclados: " + Teclado.getContadorTeclados());
        System.out.println("Total ratones: " + Raton.getContadorRatones());
        System.out.println("Total computadoras: " + Computadora.getContadorComputadoras());
        System.out.println("Total órdenes: " + Orden.getContadorOrdenes()); // Debe ser 10
    }
}