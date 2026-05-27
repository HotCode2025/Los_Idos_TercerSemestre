function miFuncion(){
}

miFuncion();

let myFuncion = function() {
    console.log('Holis perris')
}

//creamos la funcion flecha

let miFuncionFlecha = () => {
    console.log('Holis desde la funcion flecha')
}

//hay mas variables para la funcion flecha
miFuncionFlecha();

//En una sola linea

const saludar = () => console.log('Hola');

saludar();

//otro ejemplo
const saludar2 = () => {
    return 'Hola por segunda vez'
}

console.log(saludar2);

//Funcion simplificada

const saludar3 = () => 'Hola por tercera vez';

console.log(Saludar3);

//otro ejemplo

const regresaObjeto = () => ({nombre: 'Pepe', apellido: 'Lopez'});

console.log(regresaObjeto());   

//Recibe parametros

const funcionParametro = (mensaje) => console.log(mensaje); //Es buena practica usar cosnt ya que no cambia la variable en las funciones flechas

funcionParametro('Saludos con parametros');

//Parametros clasicos

const funcionParamectrosClasicos = function(mensaje) {
    console.log(mensaje);
}

funcionParamectrosClasicos('Saludos con parametros');

//Se puede omitir parentesis para una sintaxis mas simplificada

const funcionConParametro = mensaje => console.log(mensaje);

funcionConParametro('Otra vez Hola');

//Funcion flecha con varios parametros

const funcionConParametros2 = (op1, op2) => op1 + op2;

console.log(funcionConParametros2(5,4));

//Otra forma de hacerlo

const funcionConParametros2 = (op1,op2) => {
    let resultado = op1 + op2;
    return resultado;
}

console.log(funcionConParametros(2,4));





