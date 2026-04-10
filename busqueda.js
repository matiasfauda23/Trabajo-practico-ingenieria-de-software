// Lista general de talleres cargados desde el navegador.
let talleres = [];
// Guardamos el mapa para poder actualizarlo despues.
let miMapa = null;
// Guardamos una capa especial para manejar los marcadores.
let capaMarcadores = null;

// Punto de inicio de la pagina de busqueda.
function cargarPagina() {
  // Cargamos los talleres guardados en localStorage.
  talleres = obtenerTalleres();

  // Encendemos el mapa, armamos los filtros y mostramos la lista inicial.
  iniciarMapa();
  inicializarFiltros();
  listarTalleres();
}

// Lee los talleres guardados en localStorage.
function obtenerTalleres() {
  try {
    // Si hay datos, los devuelve; si no, devuelve lista vacia.
    return JSON.parse(localStorage.getItem("talleres")) || [];
  } catch (error) {
    // Si hay un error en los datos, evitamos que la pagina se rompa.
    return [];
  }
}

// Convierte un texto para compararlo mas facil.
// Sirve para ignorar mayusculas, minusculas y tildes.
function normalizarTexto(valor) {
  return (valor || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Crea el mapa de Leaflet y agrega un marcador de ejemplo.
function iniciarMapa() {
  // Si Leaflet no cargo, no intentamos crear el mapa.
  if (typeof L === "undefined") {
    return;
  }

  // Creamos el mapa y elegimos una posicion inicial.
  miMapa = L.map("mapa").setView([-34.52, -58.7], 13);

  // Cargamos el fondo del mapa desde OpenStreetMap.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(miMapa);

  // Capa donde vamos a poner y actualizar los marcadores.
  capaMarcadores = L.layerGroup().addTo(miMapa);
}

//Creamos y llenamos rellenamos los filtros
function inicializarFiltros() {
  // Tomamos los elementos de la pantalla.
  const inputNombre = document.getElementById("filtro-nombre");
  const selectCategoria = document.getElementById("filtro-categoria");

  // Armamos una lista de categorias sin repetir,
  // usando solo talleres autorizados.
  const categoriasUnicas = [
    ...new Set(
      talleres
        .filter((taller) => taller.autorizado && taller.rubro)
        .map((taller) => taller.rubro),
    ),
  ].sort((a, b) => a.localeCompare(b));

  // Cargamos cada categoria en el desplegable.
  categoriasUnicas.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    selectCategoria.append(opcion);
  });

  // Cada vez que se escribe o se cambia categoria,
  // volvemos a dibujar la lista automaticamente.
  inputNombre.addEventListener("input", listarTalleres);
  selectCategoria.addEventListener("change", listarTalleres);
}

// Muestra en pantalla solo los talleres que cumplen los filtros.
function listarTalleres() {
  // Leemos de nuevo localStorage para trabajar con datos actuales.
  talleres = obtenerTalleres();

  // Tomamos la lista visual y los valores de filtros actuales.
  const lista = document.getElementById("lista-talleres");
  const nombreBuscado = normalizarTexto(
    document.getElementById("filtro-nombre").value,
  );
  const categoriaSeleccionada =
    document.getElementById("filtro-categoria").value;

  // Limpiamos la lista antes de volver a cargar resultados.
  lista.innerHTML = "";

  // Filtramos por:
  // 1) taller autorizado
  // 2) texto del buscador (nombre del taller o colaborador)
  // 3) categoria elegida
  const talleresFiltrados = talleres.filter((taller) => {
    if (!taller.autorizado) {
      return false;
    }

    const nombreTaller = normalizarTexto(taller.nombreTaller);
    const nombreColaborador = normalizarTexto(taller.nombre);
    const coincideNombre =
      !nombreBuscado ||
      nombreTaller.includes(nombreBuscado) ||
      nombreColaborador.includes(nombreBuscado);   
    const coincideCategoria = 
      !categoriaSeleccionada || taller.rubro === categoriaSeleccionada;

    return coincideNombre && coincideCategoria;
  });

  // Si no hay coincidencias, mostramos un mensaje simple.
  if (talleresFiltrados.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No hay talleres que coincidan con los filtros.";
    lista.append(item);
    actualizarMarcadoresEnMapa([]);
    return;
  }

  // Recorremos los talleres filtrados y los mostramos en pantalla.
  talleresFiltrados.forEach((taller) => {
    // Creamos una fila de la lista.
    const item = document.createElement("li");

    // Mostramos nombre del taller y descripcion.
    item.append(taller.nombreTaller + " - " + taller.descripcion);

    // Agregamos esa fila a la lista final.
    lista.append(item);
  });

  // Actualizamos el mapa para mostrar solo talleres filtrados.
  actualizarMarcadoresEnMapa(talleresFiltrados);
}

// Dibuja en el mapa los talleres que tienen coordenadas validas.
function actualizarMarcadoresEnMapa(talleresFiltrados) {
  // Si el mapa no existe (por ejemplo, sin internet), salimos.
  if (!miMapa || !capaMarcadores) {
    return;
  }

  // Limpiamos marcadores anteriores para no duplicarlos.
  capaMarcadores.clearLayers();

  const marcadoresValidos = [];

  talleresFiltrados.forEach((taller) => {
    // Tomamos latitud y longitud guardadas al registrar el taller.
    const latitud = Number(taller.latitud);
    const longitud = Number(taller.longitud);

    // Solo agregamos marcadores con coordenadas reales.
    if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) {
      return;
    }

    // Creamos el marcador en el mapa y mostramos el nombre al hacer clic.
    const marcador = L.marker([latitud, longitud]).addTo(capaMarcadores);
    marcador.bindPopup(taller.nombreTaller || "Taller");

    // Lo guardamos para despues ajustar el zoom automaticamente.
    marcadoresValidos.push(marcador);
  });

  // Si no hay coordenadas, volvemos a la vista inicial.
  if (marcadoresValidos.length === 0) {
    miMapa.setView([-34.52, -58.7], 13);
    return;
  }

  // Ajustamos el zoom para que se vean todos los marcadores.
  const grupo = L.featureGroup(marcadoresValidos);
  miMapa.fitBounds(grupo.getBounds().pad(0.2));
}

// Cuando la pagina termina de cargar, arrancamos todo.
window.addEventListener("load", cargarPagina);
