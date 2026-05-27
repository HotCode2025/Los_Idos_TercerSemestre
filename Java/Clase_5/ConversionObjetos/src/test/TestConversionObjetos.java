package test;

import domain.*;

public class TestConversionObjetos {
    
    public static void main(String[] args) {
        
        Empleado empleado;
        
        empleado = new Escritor("Pepe", 1500, TipoEscritura.CLASICO);
        
        //System.out.println("empleado = " + empleado);
        
        System.out.println(empleado.obtenerDetalles()); //para acceder al metodo Escritor
        
        //empleado.getTipoEscritura(); no se puede
        
                //Downcasting: convertir un tipo padre a la clase hija
        
        //((Escritor)empleado).getTipoEscritura(); //Opcion1
        Escritor escritor = (Escritor)empleado; //Opcion2
        
        escritor.getTipoEscritura();
        
                //Upcasting: de tipo de clase hija a tipo de clase padre
        
        Empleado empleado2 = escritor;
        
        System.out.println(empleado2.obtenerDetalles());
    }
}
