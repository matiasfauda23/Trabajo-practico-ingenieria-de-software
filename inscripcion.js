// Punto de inicio: prepara el formulario para poder usarlo.
function main() {
    // Buscamos el formulario en la pagina.
    const formulario = document.getElementById("form-taller");

    // Cuando la persona hace clic en "Registrar Taller",
    // ejecutamos la funcion que guarda los datos.
    formulario.addEventListener("submit", manejarEnvio);
}

// Esta funcion se ejecuta al enviar el formulario.
async function manejarEnvio(evento) {
    // Evitamos que la pagina se recargue automaticamente,
    // asi podemos guardar los datos primero.
    evento.preventDefault();

    // Tomamos lo que la persona escribio en cada campo
    // y lo juntamos en un solo objeto llamado nuevoTaller.
    const direccion = document.getElementById("direccion").value;

    const nuevoTaller = {
        nombre: document.getElementById("nombre").value,
        telefono: document.getElementById("telefono").value,
        direccion: direccion,
        horarioAtencion: document.getElementById("horarioAtencion").value,
        rubro: document.getElementById("rubro").value,
        redSocial: document.getElementById("redSocial").value,
        email: document.getElementById("email").value,
        nombreTaller: document.getElementById("nombreTaller").value,
        descripcion: document.getElementById("descripcion").value,
        // Indicamos que este taller esta habilitado para mostrarse.
        autorizado: true
    };

    // Intentamos convertir la direccion a coordenadas para usarla en el mapa.
    const coordenadas = await obtenerCoordenadasDesdeDireccion(direccion);
    nuevoTaller.latitud = coordenadas.latitud;
    nuevoTaller.longitud = coordenadas.longitud;

    // Enviamos el objeto para guardarlo en el navegador.
    guardarEnDisco(nuevoTaller);

}

// Pide a Nominatim las coordenadas de una direccion.
async function obtenerCoordenadasDesdeDireccion(direccion) {
    // Armamos la URL con la direccion escrita por la persona.
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + encodeURIComponent(direccion);

    try {
        // Hacemos la consulta por internet al servicio de mapas.
        const respuesta = await fetch(url, {
            headers: {
                "Accept-Language": "es"
            }
        });

        // Si el servicio responde con error, seguimos sin coordenadas.
        if (!respuesta.ok) {
            return { latitud: null, longitud: null };
        }

        // Convertimos la respuesta a datos que JavaScript entiende.
        const resultados = await respuesta.json();

        // Si no encontro la direccion, devolvemos valores vacios.
        if (!resultados.length) {
            return { latitud: null, longitud: null };
        }

        // Guardamos la primera coincidencia como latitud y longitud.
        return {
            latitud: Number(resultados[0].lat),
            longitud: Number(resultados[0].lon)
        };
    } catch (error) {
        // Si falla internet o hay otro problema, no frenamos el registro.
        return { latitud: null, longitud: null };
    }
}

// Esta funcion guarda un taller en localStorage (memoria del navegador).
function guardarEnDisco(taller) {
    // Leemos los talleres que ya estaban guardados.
    let talleresExistentes = JSON.parse(localStorage.getItem('talleres')) || [];

    // Agregamos el nuevo taller al final de la lista.
    talleresExistentes.push(taller);

    // Guardamos toda la lista actualizada en localStorage.
    localStorage.setItem('talleres', JSON.stringify(talleresExistentes));

    // Mostramos un mensaje para confirmar que salio bien.
    alert("Taller registrado con exito!");

    // Llevamos a la persona a la pagina donde se ven los talleres.
    window.location.href = "busqueda.html";

}


// Ejecutamos main para activar todo al abrir la pagina.
main();
