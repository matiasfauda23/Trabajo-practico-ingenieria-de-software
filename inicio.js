function main(){
    const botonExp = document.getElementById("explorar")
    const botonInsc = document.getElementById("Registrar")
    botonExp.addEventListener("click",irApaginaExp);
    botonInsc.addEventListener("click",irApaginaIns);

}

function irApaginaExp(){
    window.location.href= "busqueda.html";
}

function irApaginaIns(){
    window.location.href= "inscripcion.html";
}

main();