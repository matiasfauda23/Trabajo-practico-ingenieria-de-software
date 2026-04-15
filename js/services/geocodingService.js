// Se conecta con la API de Nominatim para obtener lat/lon de una dirección.

export async function obtenerCoordenadas(direccion) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccion)}`;

  try {
    const respuesta = await fetch(url, {
      headers: { "Accept-Language": "es" },
    });

    if (!respuesta.ok) return { latitud: null, longitud: null };

    const resultados = await respuesta.json();

    if (!resultados.length) return { latitud: null, longitud: null };

    return {
      latitud: Number(resultados[0].lat),
      longitud: Number(resultados[0].lon),
    };
  } catch (error) {
    console.error("Error en geocoding:", error);
    return { latitud: null, longitud: null };
  }
}
