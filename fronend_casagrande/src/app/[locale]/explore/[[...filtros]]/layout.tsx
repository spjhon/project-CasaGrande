"use client"

import {CitySearch} from "@/components/CitySearch";
import { BreadcrumbWithCustomSeparator } from "../../../../components/Breadcrumb";
import { useParams } from "next/navigation";
import { useState } from "react";

//Importacion de fuse
import Fuse from "fuse.js"

//Importaciones del json
import ciudadesColombia from "@/data/ciudades.json"
import tipoOperacion from "@/data/tipos.json"


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


const filtrado = function (/*filtros*/) {



return {
  tipo: "",
  ciudad: "",
  universidad: "",
  barrio: "esto es un barrio"
}

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
  const [city, setCity] = useState(filtros[1]?(filtros[1]==="ciudades"?"":filtros[1]):"")

 


console.log(filtrado().barrio + " esto viene desde layout.tsx")

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
