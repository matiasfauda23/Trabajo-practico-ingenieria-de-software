// Lee todos los campos del formulario y devuelve un objeto Taller.

export function obtenerDatosFormulario() {
  return {
    nombre: document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    horarioAtencion: document.getElementById("horarioAtencion").value,
    rubro: document.getElementById("rubro").value,
    redSocial: document.getElementById("redSocial").value,
    email: document.getElementById("email").value,
    nombreTaller: document.getElementById("nombreTaller").value,
    descripcion: document.getElementById("descripcion").value,
    autorizado: true,
  };
}

export function mostrarAlerta(mensaje) {
  alert(mensaje);
}
// Nueva función: lee la foto y devuelve una Promise con el base64 (o null si no hay foto)
export function leerFoto() {
  return new Promise((resolve) => {
    // revisar.. funcion resolve: corazon del codigo //
    const archivo = document.getElementById("foto").files[0];

    // Si no eligió ninguna foto, devuelvo null
    if (!archivo) {
      resolve(null);
      return;
    }

    // Leo el archivo y lo convierto a base64
    const reader = new FileReader(); //FileReader es una herramienta de JS que sirve para leer archivos del usuario
    reader.onload = (e) => resolve(e.target.result); //lee archivo
    reader.readAsDataURL(archivo); //Esto convierte la imagen a base64, que es un formato tipo texto que podés guardar o mandar.
  });
}
