from ManejoArchivos import ManejoArchivos
# MANEJO DE CONTEXTO WITH: Sintaxis simplificada, abre y cierra el archivo.

#with open('prueba.txt', 'r', encoding='utf-8') as archivo:
 #   print(archivo.read()) 
# No es necesario cerrar el archivo, con with se cierra automáticamente.(no hace falta try ni finally)
# en el conexto de with lo que se ejecuta de manera automática es el cierre del archivo, aunque haya ocurrido un error.
# Utiliza diferentes métodos: __enter__ y __exit__ para manejar el contexto del archivo.



with ManejoArchivos('prueba.txt') as archivo:
    print(archivo.read())