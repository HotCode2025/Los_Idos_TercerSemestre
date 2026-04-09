package ar.com.system2026.mundopc;

public class Teclado extends DispositivoEntrada {
    private static int contadorTeclados = 0;
    private int idTeclado;

    public Teclado(String tipoEntrada, String marca) {
        super(tipoEntrada, marca);
        this.idTeclado = ++contadorTeclados;
    }

    public int getIdTeclado() {
        return idTeclado;
    }

    public static int getContadorTeclados() {
        return contadorTeclados;
    }

    @Override
    public String toString() {
        return "Teclado [ID: " + idTeclado + ", " + super.toString() + "]";
    }
}
