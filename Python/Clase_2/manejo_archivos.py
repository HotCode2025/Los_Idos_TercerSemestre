#Declaramos una variable

try:
    archivo = open('prueba.txt', 'w', encoding='utf-8') # LA w es de write, es decir, escribir
    archivo.write('Programamos con diferentes tipos de archovos, ahora en txt.\n')
    archivo.write('Los acentos son importantes para las palabras\n')
    archivo.write('como por ejemplo: acción, ejecución y procucción\n')
    archivo.write('Las letras son: \n"r" de read, \n"a" de append, \n"w" de write, \n"x" de create.\n')
    archivo.write('\n------------\n')
    archivo.write ('\nt es para texto o text, \nb es para binario o binary, \nw+ lee y escribe, \nr+ similar al anterior')
    archivo.write('\nPrueba de escritura recorriendo con loop for\n')
    archivo.write('Con esto terminamos')
except Exception as e:
    print(e)
finally: #Siempre se ejecuta.
    archivo.close() #Con esto se debe cerrar el archivo aunque haya ocurrido un error.
# archivo.write('Todo quedó perfecto') # Error porque el archivo ya se cerró.

