package accesodatos;

public class ImplementacionMySql implements IAccesoDatos{
  //No es sobreescritura > Es implementación (porque los métodos de la Interface están vacíos)
    @Override
    public void insertar() {
        System.out.println("Insertar desde MySQL");
    }

    @Override
    public void listar() {
      System.out.println("Listar desde MySQL");
    }

    @Override
    public void actualizar() {
       System.out.println("Actualizar desde MySQL");
    }

    @Override
    public void eliminar() {
      System.out.println("Elminar desde MySQL");
    }    
}
