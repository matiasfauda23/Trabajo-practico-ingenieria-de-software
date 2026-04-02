function main() {
    const formulario = document.getElementById("form-taller");

    //Escucho el evento y llamamos a la funcion especifica
    formulario.addEventListener( "submit", manejarEnvio );
}

//Funcion que procesa el evento
function manejarEnvio(evento) {
    //Evito que se envie el formulario
    evento.preventDefault();

    //Obtengo los datos del formulario y los guardo en un objeto litera JSON
    const datos = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        nombreTaller: document.getElementById("nombreTaller").value,
        descripcion: document.getElementById("descripcion").value
    };
    console.log("datos a enviar", datos);
    enviarDatos(datos);

}

function enviarDatos(datos) {
    console.log("Simulando envio de datos al servidor...");
    alert("Formulario enviado con exito");
}

main();