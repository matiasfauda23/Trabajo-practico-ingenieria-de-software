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
