package domain;

public class Rectangulo extends FiguraGeometrica {
    
    public Rectangulo(String tipoFigura){       //Constructor
        super(tipoFigura);
    }

    @Override
    public void dibujar() {                     //implementando el metodo
        System.out.println("Se imprime en: "+this.getClass().getSimpleName());
    }
    
    
    
}
