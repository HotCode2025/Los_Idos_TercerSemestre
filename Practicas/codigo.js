
function eleccion(jugada){
    let resultado = ""
    if (jugada == 1 ){
        resultado = "Piedra 🥌"
    } else if (jugada == 2){
        resultado = "Papel 🧻"
    } else if (jugada == 3){
        resultado = "Tijera ✂"
    } else {
        resultado = "Mal elegido ❌"
    }
        return resultado
    }

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //1: piedra 2: papel 3: tijera
    let jugador = 0
    //let max = 3
    //let min = 1
    let pc = 0 //Se deja en 0 
    let triunfos = 0
    let perdidas = 0
    //jugador = prompt("Elige: 1 piedra, 2 papel, 3 tijera")
        
    while(triunfos < 3 && perdidas < 3){
        pc = aleatorio(1,3)
        jugador = prompt("ELige: 1 PIEDRA, 2 PAPEL, 3 TIJERA")

     //alert("Elige jugador+"+jugador)
    alert("PC elige: "+eleccion(pc))
    alert("Vos elegís: "+eleccion(jugador))

    //Combate
    if(pc == jugador){
        alert("EMPATE")
    } else if(jugador == 1 && pc == 3){
        alert("GANASTE!")
        triunfos = triunfos + 1
    } else if(jugador == 2 && pc ==1){
        alert("GANASTE!")
        triunfos = triunfos + 1
    }else if(jugador == 3 && pc == 2){
        alert("GANASTE!")
        triunfos = triunfos + 1
    } else {
        alert("PERDISTE!")
        perdidas = perdidas + 1
    }
    }

    alert("Ganaste "+triunfos+" veces. Perdiste "+perdidas+" veces.")

// Crear botón
let boton = document.createElement("button")

// Texto del botón
boton.innerText = "Reiniciar juego"

// Estilos 
boton.style.fontSize = "20px"
boton.style.padding = "10px"
boton.style.cursor = "pointer"

// Acción del botón
boton.onclick = function(){
    location.reload()
}

// Mostrar botón en el navegador
document.getElementById("reinicio").appendChild(boton)