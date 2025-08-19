import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Funcion que ayuda a crear slugs a partir de texto
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD") // Descompone tildes
    .replace(/[\u0300-\u036f]/g, "") // Remueve los acentos
    .replace(/ñ/g, "n") // Reemplaza ñ
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y caracteres especiales por guiones
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio/final


    // ---- función utilitaria ---- para el componente FiltersDrawer.tsx
export function actualizarFiltros(
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
