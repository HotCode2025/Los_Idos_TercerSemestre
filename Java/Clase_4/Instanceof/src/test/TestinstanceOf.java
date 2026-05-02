
package test;

import domain.*;


public class TestinstanceOf {
    public static void main(String[] args) {
        Empleado empleado1 = new Empleado("Juan", 10000 );
        determinarTipo(empleado1);
        empleado1 = new Gerente(" José", 5000, "sistemas");
        //determinarTipo(empleado1);
    }
    
   //Con el método imprimir vamos a poder acceder a la información de la clase padre e hija
    public static void determinarTipo(Empleado empleado){
        if (empleado instanceof Gerente){
            System.out.println("Es de tipo Gerente");
            Gerente gerente = (Gerente) empleado;
            //((Gerente) empleado).getDepartamento() - Otra forma de convertir
            System.out.println("gerente = " + gerente.getDepartamento());
        }
        else if(empleado instanceof Empleado){
            System.out.println("Es de tipo Empleado");
            //Gerente gerente = (Gerente) empleado;
            //System.out.println("gerente = " + gerente.getDepartamento());
        }
        else if (empleado instanceof Object){
            System.out.println("Es de tipo Object");
        }

    }
}
