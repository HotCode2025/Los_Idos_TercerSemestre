import os

class CatalogoPeliculas:
    ruta_archivo = "peliculas.txt"

    @classmethod
    def agregar_pelicula(cls, pelicula):
        with open(cls.ruta_archivo, "a", encoding="utf8") as archivo:
            archivo.write(f"{pelicula.nombre}\n")
        print(f"Película '{pelicula.nombre}' agregada con éxito.")

    @classmethod
    def listar_peliculas(cls):
        try:
            with open(cls.ruta_archivo, "r", encoding="utf8") as archivo:
                print("\n--- Listado de Películas ---")
                contenido = archivo.read()
                if not contenido:
                    print("El catálogo está vacío.")
                else:
                    print(contenido)
                print("----------------------------")
        except FileNotFoundError:
            print("El archivo no existe. Aún no hay películas registradas.")

    @classmethod
    def eliminar(cls):
        if os.path.exists(cls.ruta_archivo):
            os.remove(cls.ruta_archivo)
            print(f"Archivo {cls.ruta_archivo} eliminado.")
        else:
            print("No existe el archivo para eliminar.")
