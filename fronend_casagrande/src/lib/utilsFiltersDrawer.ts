import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout";
import { ContractTypeState, Direction, EstratoTypeState, FiltrosState, GeneroTypeState, PetTypeState } from "@/components/exploreComponents/FiltersDrawer";


/**------------------------------------------------------------------------------------------------------------------------------- */


/**
 * Este es el object de configuracion de los filtros
 */


// Primero, definir la configuración de filtros fuera del componente
export const FILTERS_CONFIG = {
  amoblado: { Si: "amoblado", No: "sin-amoblado", Todos: null },
  alimentacion: { Si: "con-alimentacion", No: "sin-alimentacion", Todos: null },
  arregloRopa: { Si: "con-arreglo-ropa", No: "sin-arreglo-ropa", Todos: null },
  bañoPrivado: { Si: "con-bano-privado", No: "sin-bano-privado", Todos: null },
  arregloHabitacion: { Si: "arreglo-habitacion", No: "sin-arreglo-habitacion", Todos: null },
  generoOptions: [
    { slug: "todos", label: "Todos" },
    { slug: "solo-mujeres", label: "Solo Mujeres" },
    { slug: "solo-hombres", label: "Solo Hombres" },
    { slug: "mixto", label: "Mixto" },
    
  ],
  petOptions: [
    { slug: "gatos", label: "GATOS" },
    { slug: "perros-pequenos", label: "PERROS PEQUEÑOS" },
    { slug: "perros-grandes", label: "PERROS GRANDES" },
    { slug: "sin-mascotas", label: "NO SE ACEPTAN MASCOTAS" },
  ],
  contractOptions: [
    {slug: "tiempo-minimo-1-mes", label: "1 Mes"},
    {slug: "tiempo-minimo-3-meses", label: "3 Meses"},
    {slug: "tiempo-minimo-6-meses", label: "6 Meses"},
    {slug: "tiempo-minimo-1-ano", label: "1 Año"},
  ],
  estratoOptions: [
    {slug: "estrato-1", label: "Estrato 1"},
    {slug: "estrato-2", label: "Estrato 2"},
    {slug: "estrato-3", label: "Estrato 3"},
    {slug: "estrato-4", label: "Estrato 4"},
    {slug: "estrato-5", label: "Estrato 5"},
    {slug: "estrato-6", label: "Estrato 6"},
  ]
} as const;

















/**------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Aqui se encuentran las funciones que obtienen los states iniciales de acuerdo a las urls extraidas
 */



/**
 * Determina el estado inicial de un filtro binario a partir de un `slug` recibido.
 *
 * @param slug - Valor actual recibido desde la URL o estado externo. Puede ser `undefined`.
 * @param opciones - Objeto con los posibles valores de comparación:
 * - `si`: slug que representa un valor afirmativo.
 * - `no`: slug que representa un valor negativo.
 *
 * @returns El estado del filtro:
 * - `"Si"` si el `slug` coincide con `opciones.si`.
 * - `"No"` si el `slug` coincide con `opciones.no`.
 * - `"Todos"` si no coincide con ninguno de los anteriores o si es `undefined`.
 *
 * @remarks
 * Este helper es útil para inicializar filtros que pueden tener tres estados:
 * `"Si"`, `"No"` o `"Todos"`.  
 * Se usa, por ejemplo, en formularios o en filtros de búsqueda donde un campo
 * opcional puede estar activado, desactivado o no especificado.
 *
 * @example
 * ```ts
 * const opciones = { si: "solo-hombres", no: "solo-mujeres" };
 *
 * getEstadoInicial("solo-hombres", opciones); // "Si"
 * getEstadoInicial("solo-mujeres", opciones); // "No"
 * getEstadoInicial(undefined, opciones);      // "Todos"
 * getEstadoInicial("otro-valor", opciones);   // "Todos"
 * ```
 */
export function getEstadoInicial(
  slug: string | undefined,
  opciones: { si: string; no: string }
): FiltrosState {
  if (slug === opciones.si) return "Si";
  if (slug === opciones.no) return "No";
  return "Todos";
}



/**
 * Determina el estado inicial del filtro de género a partir de un `slug` recibido.
 *
 * @param slug - Cadena recibida desde la URL o estado externo.  
 * Puede ser:
 * - `"solo-hombres"`
 * - `"solo-mujeres"`
 * - `"mixto"`
 * - `undefined` u otro valor no esperado
 *
 * @returns El estado de género como `GeneroTypeState`:
 * - `"solo-hombres"`, `"solo-mujeres"` o `"mixto"` si coincide con un valor válido.
 * - `"todos"` si el valor no es reconocido o si es `undefined`.
 *
 * @remarks
 * Esta función sirve para normalizar los valores iniciales de un filtro de género,
 * garantizando que siempre se obtenga un valor válido del tipo `GeneroTypeState`.  
 * Esto evita errores al inicializar formularios o construir filtros desde parámetros de URL.
 *
 * @example
 * ```ts
 * getGeneroInicial("solo-hombres"); // "solo-hombres"
 * getGeneroInicial("mixto");        // "mixto"
 * getGeneroInicial("otro");         // "todos"
 * getGeneroInicial(undefined);      // "todos"
 * ```
 */
export function getGeneroInicial(slug: string | undefined): GeneroTypeState {
if (slug === "solo-hombres" || slug === "solo-mujeres" || slug === "mixto") {
  return slug;
}
return "todos"; // valor por defecto
}


export function getPetInicial(slug: string | undefined): PetTypeState {
if (slug === "gatos" || slug === "perros-pequenos" || slug === "perros-grandes" || slug === "sin-mascotas") {
  return slug;
}
return null; // valor por defecto
}

export function getContratoInicial(slug: string | undefined): ContractTypeState {
if (slug === "tiempo-minimo-1-mes" || slug === "tiempo-minimo-3-meses" || slug === "tiempo-minimo-6-meses" || slug === "tiempo-minimo-1-ano") {
  return slug;
}
return null; // valor por defecto
}

export function getEstratoInicial(slug: string | undefined): EstratoTypeState {
if (slug === "estrato-1" || slug === "estrato-2" || slug === "estrato-3" || slug === "estrato-4" || slug === "estrato-5" || slug === "estrato-6") {
  return slug;
}
return null; // valor por defecto
}










/**------------------------------------------------------------------------------------------------------------------------ */

/**
 * Aqui se encuentran las funciones que actualizan los diferentes states de acuerdo a la informacion que llega desde los 
 * diferentes componentes en el archivo FiltersDrawer.tsx
 * 
*/



/**
 * Cambia el estado actual dentro de la lista de estados disponibles,
 * avanzando o retrocediendo según la dirección indicada.
 *
 * @param current - Estado actual seleccionado del tipo `FiltrosState`.
 * @param setState - Función que actualiza el estado (`React.Dispatch` o equivalente).
 * @param direction - Dirección del cambio:
 * - `"next"` → avanza al siguiente estado.
 * - `"prev"` → retrocede al estado anterior.
 *
 * @remarks
 * - La lista de posibles estados está definida en la constante `estados`.  
 * - Si `current` es el último estado y la dirección es `"next"`, no cambia nada.  
 * - Si `current` es el primero y la dirección es `"prev"`, tampoco cambia nada.  
 * - Esto garantiza que el índice nunca salga de los límites del array.
 *
 * @example
 * ```ts
 * Suponiendo que estados = ["Todos", "Si", "No"]
 *
 * onClickEstado("Todos", setState, "next"); // Cambia a "Si"
 * onClickEstado("Si", setState, "next");    // Cambia a "No"
 * onClickEstado("No", setState, "next");    // No cambia (último elemento)
 *
 * onClickEstado("No", setState, "prev");    // Cambia a "Si"
 * onClickEstado("Si", setState, "prev");    // Cambia a "Todos"
 * onClickEstado("Todos", setState, "prev"); // No cambia (primer elemento)
 * ```
 */
//Constante utilizada para saber los diferentes states y hacer las respectivas comparaciones
const estados: FiltrosState[] = ["Todos", "Si", "No"];

export function onClickEstado(
  current: FiltrosState,
  setState: (value: FiltrosState) => void,
  direction: Direction) {
  const index = estados.indexOf(current);

  if (direction === "next" && index < estados.length - 1) {
    setState(estados[index + 1]);
  }

  if (direction === "prev" && index > 0) {
    setState(estados[index - 1]);
  }
}



/**
 * Cambia el estado actual del filtro de género según la dirección indicada.
 *
 * @param current - Estado actual del género seleccionado.
 * @param setState - Función para actualizar el estado del género.
 * @param direction - Dirección del cambio: `"next"` avanza al siguiente, `"prev"` retrocede al anterior.
 *
 * @remarks
 * - El orden de los estados de género está definido en el array global `estadosGenero`.
 * - Si el estado actual es el último y se pide `"next"`, no cambia.
 * - Si el estado actual es el primero y se pide `"prev"`, no cambia.
 *
 * @example
 * ```ts
 * Estados posibles en orden: ["todos", "solo-hombres", "solo-mujeres", "mixto"]
 *
 * onClickEstadoGenero("todos", setGenero, "next"); // cambia a "solo-hombres"
 * onClickEstadoGenero("mixto", setGenero, "next"); // se mantiene en "mixto"
 * onClickEstadoGenero("solo-mujeres", setGenero, "prev"); // cambia a "solo-hombres"
 * ```
 */

const estadosGenero: GeneroTypeState[] = ["todos", "solo-mujeres", "solo-hombres", "mixto"];

export function onClickEstadoGenero(
  current: GeneroTypeState,
  setState: (value: GeneroTypeState) => void,
  direction: Direction
) {
  const indexGenero = estadosGenero.indexOf(current);

  if (direction === "next" && indexGenero < estadosGenero.length - 1) {
    setState(estadosGenero[indexGenero + 1]);
  }

  if (direction === "prev" && indexGenero > 0) {
    setState(estadosGenero[indexGenero - 1]);
  }
}











/**---------------------------------------------------------------------------------------------------------------------------- */



/**
 * Aqui se encuentran las funciones utilizadas en el componente FiltersDrawer.tsx que se encargan de aceptar los states
 * que se encuentran en ese momento seleccionados y el usuario apreta submit entonces esta funcion se invoka y lo que se hace es
 * inyectar los states a la url actual y eliminar elementos de la url en caso de que los states asi lo dicten
 */
    
    // ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function updateURLFromFilters(
  estado: "Si" | "No" | "Todos",
  slugActual: string | undefined,
  mapping: { Si: string; No: string; Todos: null },
  filtros: string[]
): string[] {
  const nuevoSlug = mapping[estado];

  if (nuevoSlug) {
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros[index] = nuevoSlug;
      } else {
        filtros.push(nuevoSlug);
      }
    } else {
      filtros.push(nuevoSlug);
    }
  } else {
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros.splice(index, 1);
      }
    }
  }

  return filtros;
}



// ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltrosGenero(
  nuevoGenero: "todos" | "solo-hombres" | "solo-mujeres" | "mixto",
  slugActual: string | undefined,
  filtros: string[]
): string[] {
  if (nuevoGenero === "todos") {
    // si selecciona "todos", se elimina el slug actual si existe
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros.splice(index, 1);
      }
    }
  } else {
    // si selecciona otro género distinto de "todos"
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros[index] = nuevoGenero; // reemplazar
      } else {
        filtros.push(nuevoGenero); // agregar
      }
    } else {
      filtros.push(nuevoGenero); // agregar
    }
  }

  return filtros;
}


// ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltrosMascota(
  nuevaMascota: "gatos" | "perros-pequenos" | "perros-grandes" | "sin-mascotas" | null,
  slugActual: string | undefined,
  filtros: string[]
): string[] {
  if (nuevaMascota === null) {
    // si selecciona "todos", se elimina el slug actual si existe
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros.splice(index, 1);
      }
    }
  } else {
    // si selecciona otro género distinto de "todos"
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros[index] = nuevaMascota; // reemplazar
      } else {
        filtros.push(nuevaMascota); // agregar
      }
    } else {
      filtros.push(nuevaMascota); // agregar
    }
  }

  return filtros;
}


// ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltrosContratos(
  nuevoContrato: "tiempo-minimo-1-mes" | "tiempo-minimo-3-meses" | "tiempo-minimo-6-meses" | "tiempo-minimo-1-ano" | null,
  slugActual: string | undefined,
  filtros: string[]
): string[] {

  
  if (nuevoContrato === null) {
    // si selecciona "todos", se elimina el slug actual si existe
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros.splice(index, 1);
      }
    }
  } else {
    // si selecciona otro género distinto de "todos"
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros[index] = nuevoContrato; // reemplazar
      } else {
        filtros.push(nuevoContrato); // agregar
      }
    } else {
      filtros.push(nuevoContrato); // agregar
    }
  }

  return filtros;
}

// ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltrosEstrato(
  nuevoEstrato: "estrato-1" | "estrato-2" | "estrato-3" | "estrato-4" | "estrato-5" | "estrato-6" | null,
  slugActual: string | undefined,
  filtros: string[]
): string[] {
  if (nuevoEstrato === null) {
    
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros.splice(index, 1);
      }
    }
  } else {
    // si selecciona otro género distinto de "todos"
    if (slugActual) {
      const index = filtros.indexOf(slugActual);
      if (index !== -1) {
        filtros[index] = nuevoEstrato; // reemplazar
      } else {
        filtros.push(nuevoEstrato); // agregar
      }
    } else {
      filtros.push(nuevoEstrato); // agregar
    }
  }

  return filtros;
}

// ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltrosPrecioMinimo(
  nuevoPrecio: number | null,
  filtros: string[]
): string[] {
  // siempre buscamos si ya existe un slug que empiece con "precio-minimo-"
  const index = filtros.findIndex(f => f.startsWith("precio-minimo-"));

  if (nuevoPrecio === null || nuevoPrecio === 0) {
    // si se limpia el precio o es 0, eliminar cualquier slug que empiece por "precio-minimo-"
    if (index !== -1) {
      filtros.splice(index, 1);
    }
  } else {
    const nuevoSlug = `precio-minimo-${nuevoPrecio}`;

    if (index !== -1) {
      filtros[index] = nuevoSlug; // reemplazar el existente
    } else {
      filtros.push(nuevoSlug); // agregar nuevo
    }
  }

  return filtros;
}



// ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltrosPrecioMaximo(
  nuevoPrecio: number | null,
  filtros: string[]
): string[] {
  // siempre buscamos si ya existe un slug que empiece con "precio-maximo-"
  const index = filtros.findIndex(f => f.startsWith("precio-maximo-"));

  if (nuevoPrecio === null || nuevoPrecio === 0) {
    // si se limpia el precio o es 0, eliminar cualquier slug que empiece por "precio-maximo-"
    if (index !== -1) {
      filtros.splice(index, 1);
    }
  } else {
    const nuevoSlug = `precio-maximo-${nuevoPrecio}`;

    if (index !== -1) {
      filtros[index] = nuevoSlug; // reemplazar el existente
    } else {
      filtros.push(nuevoSlug); // agregar nuevo
    }
  }

  return filtros;
}













/*--------------------------------------------------------------------------------------------------------------------------- */

export function contarFiltrosExtras(paramsClasificados: finalResultFromClasificarParams) {
  // Filtros básicos que NO queremos contar
  const filtrosBasicos = ['tipo', 'barrio', 'ciudad', 'universidad', 'caracteristicasEspeciales'];
  
  // Contar solo las keys que NO están en filtrosBasicos
  const filtrosExtras = Object.keys(paramsClasificados).filter(
    key => !filtrosBasicos.includes(key)
  );
  
  return filtrosExtras.length;
}