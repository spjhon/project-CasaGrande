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


