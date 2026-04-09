package ar.com.system2026.mundopc;

public class Raton extends DispositivoEntrada {
    private static int contadorRatones = 0;
    private int idRaton;

    public Raton(String tipoEntrada, String marca) {
        super(tipoEntrada, marca);
        this.idRaton = ++contadorRatones;
    }

    public int getIdRaton() {
        return idRaton;
    }

    public static int getContadorRatones() {
        return contadorRatones;
    }

    @Override
    public String toString() {
        return "Ratón [ID: " + idRaton + ", " + super.toString() + "]";
    }
}
