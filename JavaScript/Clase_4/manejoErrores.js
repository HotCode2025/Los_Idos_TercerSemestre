'use strict';
// Veamos como evitar este error

try {
    let x = 10; // Lo traemos con alt + flecha hacia arriba o hacia abajo
    miFuncion();
}
catch (error) { // Catchamos el error
    console.log(error);
}
finally {
    console.log('Termina la revisión de errores');
}

console.log('Continuamos...'); // Esto no se llega a ver porque esta bloqueado