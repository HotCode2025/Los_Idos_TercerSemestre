
package test;

import domain.*;


public class TestSobreEscritura {
    public static void main(String[] args) {
        Empleado empleado1 = new Empleado("Juan", 10000 );
        imprimir(empleado1);//Aca se aplica el polimorfismo, ya que en tiempo de ejecución el método que se va a ejecutar v a ser del tipo de referencia que recibio la variable
        //System.out.println("empleado1 = " + empleado1.obtenerDetalles());
        empleado1 = new Gerente(" José", 5000, "sistemas");
        imprimir(empleado1);
        //System.out.println("gerente1 = " + gerente1.obtenerDetalles());
        //AMBOS METODOS IMPRIMIR SIRVEN PARA OBTENER INFORMACIÓN DE AMBAS CLASES
    }
    
   //Con el método imprimir vamos a poder acceder a la información de la clase padre e hija
    public static void imprimir(Empleado empleado){
        String detalles = empleado.obtenerDetalles();
            System.out.println("detalles = " + detalles);
    }
}
