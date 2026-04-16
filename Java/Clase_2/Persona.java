package domain;

public class Persona {

    private final int idPersona;
    private static int contadorPersonas;

    public Persona() {
        System.out.println("Ejecución del constructor");

        /*
    REEMPLAZO BLOQUE STATIC

    Antes:
    static {
        System.out.println("Ejecución del bloque estático");
        ++Persona.contadorPersonas;
    }

    Reemplazo:
    - Se maneja el contador dentro del constructor o en inicialización directa
    
----------------------------------------------------------------------------------

    REEMPLAZO BLOQUE NO STATIC

    Antes:
    {
        System.out.println("Ejecución del bloque NO estático");
        this.idPersona = Persona.contadorPersonas++;
    }

    Reemplazo:
    - Se mueve al constructor
    */

        // Reemplazamos ambos bloques en el constructor
        this.idPersona = ++Persona.contadorPersonas;
    }

    public int getIdPersona() {
        return this.idPersona;
    }

    @Override
    public String toString() {
        return "Persona{idPersona=" + idPersona + "}";
    }

    // Método main para probar
    public static void main(String[] args) {

        Persona p1 = new Persona();
        Persona p2 = new Persona();

        System.out.println(p1);
        System.out.println(p2);
    }
}
