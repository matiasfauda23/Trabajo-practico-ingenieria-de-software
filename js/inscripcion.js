// Punto de inicio: prepara el formulario para poder usarlo.
function main() {
  // Buscamos el formulario en la pagina.
  const formulario = document.getElementById("form-taller");

  // Cuando la persona hace clic en "Registrar Taller",
  // ejecutamos la funcion que procesa los datos.
  formulario.addEventListener("submit", manejarEnvio);
}

// Esta funcion se ejecuta al enviar el formulario.
async function manejarEnvio(evento) {
  // Evitamos que la pagina se recargue automaticamente,
  // asi podemos procesar los datos primero.
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
    autorizado: true,
  };

  // Validación mínima en cliente (los inputs ya tienen `required` en el HTML,
  // pero reforzamos comprobando campos clave).
  if (
    !nuevoTaller.nombre ||
    !nuevoTaller.email ||
    !nuevoTaller.nombreTaller ||
    !nuevoTaller.direccion
  ) {
    alert("Por favor completá los campos obligatorios antes de continuar.");
    return;
  }

  // Intentamos convertir la direccion a coordenadas para usarla en el mapa.
  const coordenadas = await obtenerCoordenadasDesdeDireccion(direccion);
  nuevoTaller.latitud = coordenadas.latitud;
  nuevoTaller.longitud = coordenadas.longitud;

  // MAQUETA ESTATICA: no persistimos en localStorage ni en servidor.
  // Conservamos la notificación al usuario y redirigimos a la vista de búsqueda.
  alert("Taller cargado correctamente");
  window.location.href = "busqueda.html";
}

// Pide a Nominatim las coordenadas de una direccion.
async function obtenerCoordenadasDesdeDireccion(direccion) {
  // Armamos la URL con la direccion escrita por la persona.
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(direccion);

  try {
    // Hacemos la consulta por internet al servicio de mapas.
    const respuesta = await fetch(url, {
      headers: {
        "Accept-Language": "es",
      },
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
      longitud: Number(resultados[0].lon),
    };
  } catch (error) {
    // Si falla internet o hay otro problema, no frenamos el registro.
    return { latitud: null, longitud: null };
  }
}

// Ejecutamos main para activar todo al abrir la pagina.
main();
