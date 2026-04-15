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
    item.textContent = `${taller.nombreTaller} - ${taller.descripcion || ""}`;
    lista.append(item);
  });
}

export function actualizarMapa(talleresFiltrados) {
  if (!miMapa || !capaMarcadores) return;
  capaMarcadores.clearLayers();

  const marcadores = talleresFiltrados.map((taller) => {
    const marcador = L.marker([
      Number(taller.latitud),
      Number(taller.longitud),
    ]).addTo(capaMarcadores);
    marcador.bindPopup(taller.nombreTaller);
    return marcador;
  });

  if (marcadores.length > 0) {
    const grupo = L.featureGroup(marcadores);
    miMapa.fitBounds(grupo.getBounds().pad(0.2));
  }
}
