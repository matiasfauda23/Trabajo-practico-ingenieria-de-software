let miMapa = null;
let capaMarcadores = null;

export function iniciarMapa() {
  if (typeof L === "undefined") return;
  miMapa = L.map("mapa").setView([-34.52, -58.7], 13);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    },
  ).addTo(miMapa);

  capaMarcadores = L.layerGroup().addTo(miMapa);
}

export function dibujarLista(talleresFiltrados) {
  const lista = document.getElementById("lista-talleres");
  lista.innerHTML = "";

  if (talleresFiltrados.length === 0) {
    lista.innerHTML = "<li>No hay talleres que coincidan.</li>";
    return;
  }

  talleresFiltrados.forEach((taller) => {
    const item = document.createElement("li");
    item.classList.add("tarjeta-taller");

    // Generamos el ID de forma consistente
    const idUnico = taller.id || taller.nombreTaller.replace(/\s+/g, "-");
    item.id = `item-taller-${idUnico}`;

    item.innerHTML = `
        <strong>${taller.nombreTaller}</strong>
        <span>${taller.rubro || ""}</span>
        <span>${taller.horarioAtencion || ""}</span>
     `;

    item.addEventListener("click", () => {
      if (miMapa) {
        miMapa.setView([Number(taller.latitud), Number(taller.longitud)], 16);
      }

      //Llamamos al nombre correcto de la funcion y pasamos el ID
      resaltarEnLista(idUnico);
      abrirPanel(taller);
    });

    lista.append(item);
  });
}

function resaltarEnLista(tallerId) {
  //Primero, removemos la clase de todos los items para quitar cualquier resaltado previo
  document.querySelectorAll(".tarjeta-taller").forEach((li) => {
    li.classList.remove("taller-activo");
  });

  //Buscar el item con el ID específico y resaltarlo
  const elementoLista = document.getElementById(`item-taller-${tallerId}`);

  if (elementoLista) {
    elementoLista.classList.add("taller-activo");
    elementoLista.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

export function actualizarMapa(talleresFiltrados) {
  if (!miMapa || !capaMarcadores) return;
  capaMarcadores.clearLayers();

  const marcadores = talleresFiltrados.map((taller) => {
    const lat = Number(taller.latitud);
    const lng = Number(taller.longitud);
    const idUnico = taller.id || taller.nombreTaller.replace(/\s+/g, "-");

    const marcador = L.marker([lat, lng]).addTo(capaMarcadores);
    marcador.bindPopup(`<strong>${taller.nombreTaller}</strong>`);

    marcador.on("click", () => {
      miMapa.setView([lat, lng], 16);
      abrirPanel(taller);
      resaltarEnLista(idUnico);
    });

    return marcador;
  });

  if (marcadores.length > 0) {
    const grupo = L.featureGroup(marcadores);
    miMapa.fitBounds(grupo.getBounds().pad(0.2));
  }
}

export function configurarSelectorCategorias(rubros) {
  const select = document.getElementById("filtro-categoria");

  // Limpiar el select dejando solo la primera opcion
  select.innerHTML = '<option value="">Todas las categorías</option>';

  // Recorrer y agregar
  rubros.forEach((rubro) => {
    const option = document.createElement("option");
    option.value = rubro;
    option.textContent = rubro;
    select.appendChild(option);
  });
}
// Funcion que arma y muestra el panel lateral con la info del taller
function abrirPanel(taller) {
  // Busco el panel en el HTML, si no existe lo creo
  let panel = document.getElementById("panel-detalle");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "panel-detalle";
    document.body.append(panel);
  }

  // Relleno el panel con los datos del taller seleccionado
  panel.innerHTML = `
    <button id="btn-cerrar-panel" onclick="cerrarPanel()">✕</button>
    ${
      taller.foto
        ? `<img src="${taller.foto}" alt="Foto del taller" style="width:100%; border-radius:8px;"/>`
        : ""
    }
    <h2>${taller.nombreTaller}</h2>
    <p class="panel-rubro">📌 ${taller.rubro || "Sin rubro"}</p>
    <hr/>
    <p>📝 ${taller.descripcion || "Sin descripción"}</p>
    <p>📍 ${taller.direccion || "Sin dirección"}</p>
    <p>🕐 ${taller.horarioAtencion || "Sin horario"}</p>
    <p>📞 ${taller.telefono || "Sin teléfono"}</p>
    <p>✉️ <a href="mailto:${taller.email}">${taller.email || "Sin email"}</a></p>
    <p>🌐 <a href="${taller.redSocial}" target="_blank">Ver red social</a></p>
  `;

  // Agrego la clase que lo hace visible (con animación CSS)
  panel.classList.add("panel-abierto");
}

// Funcion global para cerrar el panel (la uso desde el botón ✕ en el HTML del panel)
window.cerrarPanel = function () {
  const panel = document.getElementById("panel-detalle");
  if (panel) {
    // Saco la clase para ocultarlo con animación
    panel.classList.remove("panel-abierto");
  }
};
