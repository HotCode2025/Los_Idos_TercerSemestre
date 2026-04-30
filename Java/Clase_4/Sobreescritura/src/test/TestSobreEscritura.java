
package test;

import domain.Gerente;


public class TestSobreEscritura {
    public static void main(String[] args) {
        Gerente gerente1 = new Gerente(" José", 5000, "sistemas");
        System.out.println("gerente1 = " + gerente1.obtenerDetalles());
    }
}
