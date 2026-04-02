function cargarPagina() {
    iniciarMapa();
    listarTalleres();
}


function iniciarMapa() {
    //Creamos el mapa
    const miMapa = L.map('mapa').setView([-34.52, -58.70], 13);

    //Cargamos openstreetmap para mostrar el mapa y lo cargamos a nuestro mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(miMapa);

    //Pin de prueba
    L.marker([-34.522, -58.700]).addTo(miMapa)
        .bindPopup('Taller de Prueba - Centro Cultural')
        .openPopup();
}

function listarTalleres() {
    const lista = document.getElementById("lista-talleres");
    //LocalStorage es una peq db que vive en el navegador, pasamos el texto obtenido a un obj de js
    const talleres = JSON.parse(localStorage.getItem('talleres')) || [];

    //Recorremos el arreglo de talleres y los mostramos en la lista
    talleres.forEach(taller => {
        //Creo el elemento de lista
        const item = document.createElement("li");

        //Agrego el nombre del taller y su descripcion al item
        item.append(taller.nombreTaller + " - " + taller.descripcion);

        //Agrego el item a la lista
        lista.append(item);
    });
}

window.addEventListener('load', cargarPagina);