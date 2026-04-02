function main() {
    const formulario = document.getElementById("form-taller");

    //Escucho el evento y llamamos a la funcion especifica
    formulario.addEventListener("submit", manejarEnvio);
}

//Funcion que procesa el evento
function manejarEnvio(evento) {
    //Evito que se envie el formulario
    evento.preventDefault();

    //Obtengo los datos del formulario y los guardo en un objeto que taller
    const nuevoTaller = {
        nombre: document.getElementById("nombre").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        horarioAtencion: document.getElementById("horarioAtencion").value,
        rubro: document.getElementById("rubro").value,
        redSocial: document.getElementById("redSocial").value,
        email: document.getElementById("email").value,
        nombreTaller: document.getElementById("nombreTaller").value,
        descripcion: document.getElementById("descripcion").value,
        //Por defecto el taller arranca sin estar autorizado
        autorizado: false
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