package test;

import accesodatos.*;

public class TestInterfaces {
    public static void main(String[] args) {
       // IAccesoDatos datos = new IAccesoDatos();  => Una Interface no se puede instanciar.
       IAccesoDatos datos = new ImplementacionMySql();
       //datos.listar();
       
       datos = new ImplementacionOracle();   //Misma variable donde recibe 
       //datos.listar();
       
        imprimir(datos);
    }
        public static void imprimir(IAccesoDatos datos){
        datos.listar();
    }
}
