function main() {
    const formulario = document.getElementById("form-taller");

    //Escucho el evento y llamamos a la funcion especifica
    formulario.addEventListener("submit", manejarEnvio);
}

//Funcion que procesa el evento
function manejarEnvio(evento) {
    //Evito que se envie el formulario
    evento.preventDefault();

    //Obtengo los datos del formulario y los guardo en un objeto litera JSON
    const nuevoTaller = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        nombreTaller: document.getElementById("nombreTaller").value,
        descripcion: document.getElementById("descripcion").value
    };
    guardarEnDisco(nuevoTaller);

}

function guardarEnDisco(taller) {
    //Guardamos los datos en el localStorage
    let talleresExistentes = JSON.parse(localStorage.getItem('talleres')) || [];
    talleresExistentes.push(taller);
    localStorage.setItem('talleres', JSON.stringify(talleresExistentes));
    //Le aviso al usuario
    alert("Taller registrado con exito!");

    //redirijo a la pagina de busqueda
    window.location.href = "busqueda.html";

}


main();