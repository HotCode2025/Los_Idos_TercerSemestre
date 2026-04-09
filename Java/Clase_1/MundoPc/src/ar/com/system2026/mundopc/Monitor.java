package ar.com.system2026.mundopc;

public class Monitor {
    private static int contadorMonitores = 0;
    private final int idMonitor;
    private String marca;
    private double tamanio;

    private Monitor() {
        this.idMonitor = ++contadorMonitores;
    }
    
    public Monitor(String marca, double tamanio) {
        this();  // llamado al constructor vacío
        this.marca = marca;
        this.tamanio = tamanio;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public double getTamanio() {
        return tamanio;
    }

    public void setTamanio(double tamanio) {
        this.tamanio = tamanio;
    }

    public int getIdMonitor() {
        return this.idMonitor;
    }

    // ✅ Getter estático añadido
    public static int getContadorMonitores() {
        return contadorMonitores;
    }

    @Override
    public String toString() {
        return "Monitor [ID: " + idMonitor + ", Marca: " + marca + ", Tamaño: " + tamanio + "]";
    }
}