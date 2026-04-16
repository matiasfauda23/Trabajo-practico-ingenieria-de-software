// Importo lo necesario de otros modulos
import { filtrarTalleres, obtenerRubrosUnicos } from "../models/modelo.js";
import {
  iniciarMapa,
  dibujarLista,
  actualizarMapa,
  configurarSelectorCategorias,
} from "../views/vista.js";

//Controlador: Coordina la interaccion entre modelo.js y vista.js

// Lista local para manejar los datos en este archivo
let talleres = [];

function cargarPagina() {
  talleres = typeof TALLERES_MOCK !== "undefined" ? TALLERES_MOCK.slice() : [];
  iniciarMapa();
  inicializarFiltros();
  listarTalleres();
}

function inicializarFiltros() {
  // Obtenemos los datos
  const rubros = obtenerRubrosUnicos(talleres);

  // Mandamos a dibujar
  configurarSelectorCategorias(rubros);

  // Escuchamos los eventos
  document
    .getElementById("filtro-nombre")
    .addEventListener("input", listarTalleres);
  document
    .getElementById("filtro-categoria")
    .addEventListener("change", listarTalleres);
}

// Esta es la función principal del controlador
function listarTalleres() {
  // Tomamos los valores de la pantalla
  const nombreBuscado = document.getElementById("filtro-nombre").value;
  const categoriaSeleccionada =
    document.getElementById("filtro-categoria").value;

  // Pedimos al modelo que procese los datos
  const filtrados = filtrarTalleres(
    talleres,
    nombreBuscado,
    categoriaSeleccionada,
  );

  // Le ordenamos a la vista que dibuje los resultados
  dibujarLista(filtrados);
  actualizarMapa(filtrados);
}

// Arrancamos todo
window.addEventListener("load", cargarPagina);
