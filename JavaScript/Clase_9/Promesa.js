let miPromesa = new Promise( (resolver,rechazar) => { //Declaramos la variable tipo promesa y luego el objeto
    let expresion = true;
    if (expresion){
        resolver ('Resolvió correctamente');
    
    } else{
        rechazar('Se produjo un error');
    }

})

//CASO THEN
//miPromesa.then(
//    valor => console.log(valor),
//    error => console.log(error)
//);

//CASO CATCH
//miPromesa
//   .then( valor => console.log(valor))
//   .catch(error => console.log(error));

let promesa = new Promise ( (resolver) => {
    //console.log('Inicio promesa');
    setTimeout(() => resolver ('Saludos desde promesa, callback, función flecha y setTimeout '), 3000)
    //console.log('Final promesa');
});

//El llamado a la promesa utilizando setTimeout
//promesa.then (valor => console.log( valor));

//PALABRA ASYNG CON PROMESA: Nos permite facilitar el uso de promesas, nos indica que una funcion regresa una promesa
async function miFuncionConPromesa(){
    return 'Saludos con promesa y async';
}

//miFuncionConPromesa().then (valor => console.log(valor));

//Async / AWAIT:espera el resultado de una promesa, AWAIT solo se puede usar con una funcion declarada con async

async function funcionConPromesaYAwait(){
    let miPromesa = new Promise (resolver => {
        resolver('Promesa con await');
    });
    console.log(await miPromesa);
}
//funcionConPromesaYAwait();

//Promesas await, async y setTimeout
async function funcionConPromesaYAwaitTimeout(){
    let miPromesa = new Promise (resolver => {
        console.log('inicio funcion');
        setTimeout (() => resolver ('Promesa con await y Timeout'), 3000);
        console.log('Final funcion')
    });
    console.log(await miPromesa);
}

//Llamamos a la funcion
funcionConPromesaYAwaitTimeout();
