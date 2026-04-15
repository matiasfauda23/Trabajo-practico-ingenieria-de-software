import { normalizarTexto } from "./utils.js";

export function filtrarTalleres(lista, textoBusqueda, categoriaSeleccionada) {
  const busquedaCriterio = normalizarTexto(textoBusqueda);

  return (lista || []).filter((taller) => {
    if (!taller || !taller.autorizado) return false;

    const nombreTaller = normalizarTexto(taller.nombreTaller);
    const nombreColaborador = normalizarTexto(taller.nombre);

    const coincideNombre =
      !busquedaCriterio ||
      nombreTaller.includes(busquedaCriterio) ||
      nombreColaborador.includes(busquedaCriterio);

    const coincideCategoria =
      !categoriaSeleccionada || taller.rubro === categoriaSeleccionada;

    return coincideNombre && coincideCategoria;
  });
}
