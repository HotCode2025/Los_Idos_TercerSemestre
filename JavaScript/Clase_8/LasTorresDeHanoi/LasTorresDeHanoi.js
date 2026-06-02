let contMov = 0;

function hanoi(n, origen, destino, aux) {
    if (n === 1) {  //Si solo hay 1 disco, lo muevo
        contMov++;
        console.log(`${contMov}. Mover disco 1 de ${origen} a ${destino}`);
        return;
    }
    
    hanoi(n - 1, origen, aux, destino);    //muevo n-1 a auxiliar
    
    contMov++;
    console.log(`${contMov}. Mover disco ${n} de ${origen} a ${destino}`);  //muevo disco n a destino (el mas grande)
    
    hanoi(n - 1, aux, destino, origen);    //muevo disco n-1 de auxiliar a destino

}

console.log('Torres de Hanoi - Solucion a los 3 discos');

contMov = 0;

hanoi(3, "A", "C", "B");

console.log(`Total de movimientos necesarios: ${contMov}`);