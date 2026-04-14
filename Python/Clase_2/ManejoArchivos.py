class ManejoArchivos:
    def __init__ (self, nombre):
        self.nombre = nombre
    
    def __enter__(self):  # Método que se ejecuta al entrar al contexto del with.
        print('Obtenemos el recurso'.center(50, '-'))
        self.nombre = open(self.nombre, 'r', encoding='utf-8') # Encapsulamos el código dentro del método
        return self.nombre # Retornamos el recurso para que pueda ser utilizado en el bloque de código del with.
    
    def __exit__(self, tipo_excepcion, valor_excepcion, traceback): # Método que se ejecuta al salir del contexto del with, aunque haya ocurrido un error.
        print('Cerramos el recurso'.center(50, '-'))
        if self.nombre:
            self.nombre.close() # Cerramos el recurso, aunque haya ocurrido un error.
      