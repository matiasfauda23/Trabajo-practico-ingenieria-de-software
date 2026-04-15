// Importo lo necesario de otros modulos
import { filtrarTalleres } from "./js/modelo.js";
import { iniciarMapa, dibujarLista, actualizarMapa } from "./js/vista.js";

// Lista local para manejar los datos en este archivo
let talleres = [];

function cargarPagina() {
  talleres = typeof TALLERES_MOCK !== "undefined" ? TALLERES_MOCK.slice() : [];
  iniciarMapa();
  inicializarFiltros();
  listarTalleres();
}

function inicializarFiltros() {
  const inputNombre = document.getElementById("filtro-nombre");
  const selectCategoria = document.getElementById("filtro-categoria");

  // Cargamos las categorias en el select
  const categoriasUnicas = [
    ...new Set(
      talleres.filter((t) => t.autorizado && t.rubro).map((t) => t.rubro),
    ),
  ].sort();

  categoriasUnicas.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    selectCategoria?.append(opt);
  });

  // Escuchamos los cambios para actualizar la lista
  inputNombre?.addEventListener("input", listarTalleres);
  selectCategoria?.addEventListener("change", listarTalleres);
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
