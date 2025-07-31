"use client"

import {CitySearch} from "@/components/CitySearch";
import { BreadcrumbWithCustomSeparator } from "../../../../components/Breadcrumb";
import { useParams } from "next/navigation";
import { useState } from "react";

//Importacion de fuse
import Fuse from "fuse.js"

//Importaciones del json
import ciudadesColombia from "@/data/ciudades.json"
/**
 * Tipos llegan con esta estructura
 * {
        "id":1,
        "tipo":"Habitacion Estudiantil Familiar",
        "slug":"arriendo-habitacion-estudiantil-familiar"
    },
 */
import tipoOperacion from "@/data/tipos.json"
//Los barrios llegan con esta estructura
/*{"id": "1","nombre": "Palogrande","slug": "palogrande","ciudad": "Manizales","departamento": "Caldas"},*/
import barrios from "@/data/barrios.json"
/**
 * Universidades llegan con esta estructura
 * {
    "id": "1",
    "nombre": "Universidad de Caldas - Sede Central",
    "slug": "universidad-de-caldas-sede-central",
    "tipo": "Pública",
    "ciudad": "Manizales",
    "departamento": "Caldas",
    "universidad": "Universidad de Caldas"
  },
 */
import universidades from "@/data/universidades_manziales.json"

/**
 * Este va a ser un componente que va a recopilar la url, la va a parsear y enviar los repectivos states a todos los hijos
 * los 6 niveles de la url es:
 * explorer(habitaciones)/tipo/ciudad/universidad/barrio
 * y para las propiedades será explorer(habitaciones)/slug-de-la-habitacion/id
 * y para los user seria explorer(habitaciones)/guest/id
 */

//estraccion de los datos del json
//Explicacion de este flatmap al final de este archivo
//La estructura final es algo asi por cada elemento del array final
//Object { city: "leticia", label: "Leticia", departamento: "Amazonas" }
//Object { city: "puerto nariño", label: "Puerto Nariño", departamento: "Amazonas" }
//como se puede observar el departamento esta repetido con el fin de tener un solo object por ciudad con su respectivo deptarta
//1. Formateo de ciudades
const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD") // Descompone tildes
    .replace(/[\u0300-\u036f]/g, "") // Remueve los acentos
    .replace(/ñ/g, "n") // Reemplaza ñ
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y caracteres especiales por guiones
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio/final

const ciudades = ciudadesColombia.flatMap((dep) =>
  dep.ciudades.map((ciudad) => ({
    city: slugify(ciudad),
    label: ciudad,
    departamento: dep.departamento,
  }))
)


interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    filtros?: string[];
  };
}

// 2. Inicializamos Fuse
const fuse = new Fuse(ciudades, {
  keys: ["label", "departamento"],
  threshold: 0.3,
})


type GrupoNombre = "ciudad" | "barrio" | "universidad" | "tipo"

type ResultadoFiltro = {
  grupo: GrupoNombre;
  slug: string;
  label: string;
}

/**
 * 
 * @param filtros son los filtros que llegan de los params
 * @returns Entonces Record sería un objeto que tiene exactamente 4 claves (ciudad, barrio, universidad, tipo) 
 * y cada una debe tener un valor del tipo ResultadoFiltro. y Partial Convierte todas las propiedades de un tipo en opcionales.
 */
 function identificarFiltros(filtros: string[]): Partial<Record<GrupoNombre, ResultadoFiltro>> {
  const resultado: Partial<Record<GrupoNombre, ResultadoFiltro>> = {}


  /**
   * Un Set es una colección de valores únicos. Es como un array, pero:
    - No permite elementos duplicados.
    - Tiene métodos como .add(), .has(), .delete().
    - Su propósito es verificar presencia o ausencia rápida de valores.
    Le estás diciendo a TypeScript que este Set solo va a contener valores de tipo string.
(Ej: "manizales", "arriendo", "palogrande"... etc.
   */
  const usados = new Set<string>();

  filtros.forEach((filtro) => {
    if (usados.has(filtro)) return;

    //Tu código sí tiene una prioridad implícita en el orden en que se buscan los matches:
    /**
     * Eso significa:
    - Primero intenta match con tipo
    - Luego con ciudad
    - Luego con barrio
    - Y por último con universidad
     */
    const matchTipo = tipoOperacion.find(t => t.slug === filtro);
    if (matchTipo && !resultado.tipo) {
      resultado.tipo = { grupo: "tipo", slug: matchTipo.slug, label: matchTipo.tipo };
      usados.add(filtro);
      return;
    }

    const matchCiudad = ciudades.find(c => c.city === filtro);
    if (matchCiudad && !resultado.ciudad) {
      resultado.ciudad = { grupo: "ciudad", slug: matchCiudad.city, label: matchCiudad.label };
      usados.add(filtro);
      return;
    }

    const matchBarrio = barrios.find(b => b.slug === filtro);
    if (matchBarrio && !resultado.barrio) {
      resultado.barrio = { grupo: "barrio", slug: matchBarrio.slug, label: matchBarrio.nombre };
      usados.add(filtro);
      return;
    }

    const matchUniversidad = universidades.find(u => u.slug === filtro);
    if (matchUniversidad && !resultado.universidad) {
      resultado.universidad = { grupo: "universidad", slug: matchUniversidad.slug, label: matchUniversidad.nombre };
      usados.add(filtro);
      return;
    }
  });

  return resultado;
}



/**
 * 
 * @param children
 * params
 *
 * @returns el respectivo page con los hijos y sus respectivos states
 */
export default function ExploreLayout({children}: RootLayoutProps) {



  const params = useParams() as { filtros?: string[] };
  const filtros = params.filtros || [];
  const [city, setCity] = useState(filtros[1]?(filtros[1]==="ciudadesss"?"":filtros[1]):"")

  console.log(identificarFiltros(filtros))

/*
OJO, EL PRIMER RENDER AL MONTAR EL COMPONENTE ES EN EL SERVIDOR, EL RESTO ES EN EL CLIENTE
if (typeof window !== "undefined") {
    console.log("Ciudad cambió en el CLIENTE:", city);
  } else {
    console.log("Ciudad cambió en el SERVIDOR:", city);
  }*/
//console.log(filtrado().barrio + " esto viene desde layout.tsx")

  return (
    <section>
      <div className="flex items-center justify-between border-2 border-amber-800 h-60">
        <div>
          <BreadcrumbWithCustomSeparator items={filtros} />
          
          <div>
            
            este es el div del mensaje de donde esta la busqueda actualmente
          </div>

          <h1>Parámetros de la URL:</h1>
          <ul>
            {filtros.map((item, index) => (
              <li key={index}>
                {index + 1}. {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          Div de los botones de filtro y orden
          <CitySearch city={city} setCity={setCity}></CitySearch>
          
        </div>
      </div>

      {children}
    </section>
  );
}
