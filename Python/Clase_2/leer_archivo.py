#Lectura de archivos
try:
    archivo = open('prueba.txt', 'r', encoding='utf-8') #Las letra son "r" de read, "a" de append, "w" de write, "x" de create.
    #print(archivo.read())
    #print(archivo.read(15))
    #print(archivo.read(10)) #Continuamos desde la línea anterior.
    #print(archivo.readline()) #Lee una línea comlpeta.
    #print(archivo.readline()) #Lee la siguiente línea completa.

    # Vamos a iterar el archivo, cada una de las líneas:

    #for linea in archivo:
        #print(linea) # iteramos todos los elementos del archivo

    print(archivo.readlines()[4]) # accedemos al archivo como si fuera una lista y cada línea es un elemento de la lista.


    # Anexamos información, copiamos a otro archivo.
    archivo2 = open('copia.txt', 'w', encoding='utf-8')
    archivo2.write(archivo.read())    
except Exception as e:
    print(e)
finally:
    archivo.close() #Cerramos el primer archivo
    archivo2.close() #Cerramos el segundoi archivo.