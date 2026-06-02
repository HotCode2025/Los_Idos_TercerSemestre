package accesodatos;

public interface IAccesoDatos {     //Una Interface no hereda de la clase Object !!
    int MAX_REGISTRO = 10;            // Es una constante (public final static). Siempre se le asigna un valor.
    
    
    //Método insertar (abstracto y sin cuerpo)
    void insertar();
    
    void listar();
    
    void actualizar();
    
    void eliminar();
}
