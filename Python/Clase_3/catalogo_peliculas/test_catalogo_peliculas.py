from dominio.pelicula import Pelicula
from servicio.catalogo_peliculas import CatalogoPeliculas as cp

def ejecutar_menu():
    opcion = None
    while opcion != 4:
        try:
            print("\n--- MENÚ CATÁLOGO DE PELÍCULAS ---")
            print("1. Agregar película")
            print("2. Listado de películas")
            print("3. Eliminar archivo de películas")
            print("4. Salir")
            opcion = int(input("Seleccione una opción (1-4): "))

            if opcion == 1:
                nombre_pelicula = input("Ingresá el nombre de la película: ")
                pelicula = Pelicula(nombre_pelicula)
                cp.agregar_pelicula(pelicula)

            elif opcion == 2:
                cp.listar_peliculas()

            elif opcion == 3:
                cp.eliminar()

            elif opcion == 4:
                print("Saliendo del programa. ¡Hasta luego!")

            else:
                print("Opción no válida. Intente de nuevo.")

        except ValueError:
            print("Error: Por favor, ingrese un número entero.")
        except Exception as e:
            print(f"Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    ejecutar_menu()
