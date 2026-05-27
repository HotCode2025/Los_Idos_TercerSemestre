
package domain;

public enum TipoEscritura {
    CLASICO ("Escritura a mano"),
    MODERNO ("Escruitura digital"); //IMPORTANTE: cuando usamos enum, el (;) solo va al final de la lista, todos los elemntos antyeriores van con (,)
    
    private final String descripcion;
    
    private TipoEscritura (String descripcion) {    //constructor
        this.descripcion = descripcion;
    }

    //Metodo get
    
    public String getDescripcion() {
        return this.descripcion;
    }
}
