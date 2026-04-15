// Controlador
// En js/controllers/inscripcion.js
import {
  obtenerDatosFormulario,
  mostrarAlerta,
} from "../views/inscripcionVista.js";
import { obtenerCoordenadas } from "../services/geocodingService.js";

async function manejarEnvio(evento) {
  evento.preventDefault();

  // La Vista me da los datos
  const nuevoTaller = obtenerDatosFormulario();

  // Validacion basica
  if (
    !nuevoTaller.nombre ||
    !nuevoTaller.direccion ||
    !nuevoTaller.nombreTaller
  ) {
    mostrarAlerta("Por favor completá los campos obligatorios.");
    return;
  }

  // El Servicio me da las coordenadas
  const coords = await obtenerCoordenadas(nuevoTaller.direccion);
  nuevoTaller.latitud = coords.latitud;
  nuevoTaller.longitud = coords.longitud;

  // Finalizar flujo
  mostrarAlerta("Taller cargado correctamente");
  window.location.href = "busqueda.html";
}

function main() {
  const formulario = document.getElementById("form-taller");
  formulario?.addEventListener("submit", manejarEnvio);
}

main();
