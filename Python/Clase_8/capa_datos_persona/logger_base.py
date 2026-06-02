import logging as log # Importamos el módulo de logging y lo renombramos como log para facilitar su uso.

# Llamamaos una configuración básica para el logging.

log.basicConfig(level=log.DEBUG,
                format= '%(asctime)s:%(levelname)s [%(filename)s:%(lineno)s] %(message)s', # Establecemos el nivel de logging a DEBUG para que se muestren todos los mensajes.)
                datefmt='%I:%M:%S %p',
                handlers=[
                    log.FileHandler('capa_datos.log'), # Agregamos un manejador de archivos para guardar los logs en un archivo llamado 'capa_datos.log'.
                    log.StreamHandler() # Agregamos un manejador de flujo para mostrar los logs en la consola.
                ])

if __name__ == '__main__':
    log.debug('Mensaje a nivel debug') 
    log.info('Mensaje a nivel info') 
    log.warning('Mensaje a nivel warning') 
    log.error('Mensaje a nivel error')
    log.critical('Mensaje a nivel critical')