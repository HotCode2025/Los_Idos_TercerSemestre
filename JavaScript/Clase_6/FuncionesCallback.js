miFuncion1()
miFuncion2()

function miFuncion1(){
    console.log('Funcion 1');
}

function miFuncion2(){
     console.log('Funcion 2');
}

//Funcion de tipo callback
let imp = function imprimir ( mensaje ){
    console.log( mensaje );
}
function sumar(op1, op2, funcionCallback){
    let res = op1 + op2;
    funcionCallback(res);

}
sumar(5, 3, imp);

//Llamadas asincronas con uso de setTimeout
function miFuncionCallback(){
    console.log('Saludo asincrono despues de 3 segundos');
}
setTimeout(miFuncionCallback, 3000);

setTimeout( function(){console.log('Saludo asincrono 2')},4000);

setTimeout( () => console.log('Saludos Asincronos 3'),5000);

let reloj = () => {

    let fecha = new Date();
    console.log(`${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`);

}

setInterval(reloj, 1000);//Cada  segundo se ejecuta






