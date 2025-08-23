/**
 * Este va a ser un componente que va a recopilar la url, la va a parsear y enviar los repectivos states a todos los hijos
 * los 6 niveles de la url es:
 * explorer(habitaciones)/tipo/ciudad/universidad/barrio
 * y para las propiedades será explorer(habitaciones)/slug-de-la-habitacion/id
 * y para los user seria explorer(habitaciones)/guest/id
*/


//Importacion de componentes
import {SearchCity} from "@/components/exploreComponents/SearchCity";
import { BreadcrumbWithCustomSeparator } from "../../../../components/exploreComponents/Breadcrumb";


//Importaciones del json
/**
 * Lista de ciudades de Colombia con su departamento.
 * { id: string, departamento: string, ciudades: string[] }
 */
import colombianCitiesJson from "@/data/ciudades.json"

/** Tipos de operacion que el cliente busca como Habitacion Estudiantil Familiar
 * {"id": string,"tipo": string,"slug":"string"},
 */
import typeOperationJson from "@/data/tipos.json"

/**
 * Los neighborhoodJson llegan con esta estructura
 *{"id": string,"nombre": string,"slug": string,"ciudad": string,"departamento": string}
 */
import neighborhoodJson from "@/data/barrios.json"

/**
 * Universidades llegan con esta estructura
 * {"id": string, "nombre": string, "slug": string, "tipo": string, "ciudad": string, "departamento": string, "universidad": string}
 */
import universitiesJson from "@/data/universidades.json"

/**
 * Filtros extra llegan con esta estructura
 * {"id": string, "label": string, "slug": string}
 */
import extraFiltersJson from "@/data/filtrosExtra.json"

//Importacion de funciones utilitarias
import { slugify } from "@/lib/utils";

//Importacion de componentes utilizados en el return
import { SearchNeightbor } from "@/components/exploreComponents/SearchNeightbor";
import { SearchType } from "@/components/exploreComponents/SearchType";
import { SearchUniversity } from "@/components/exploreComponents/SearchUniversity";
import { FiltersDrawer } from "@/components/exploreComponents/FiltersDrawer";

//Los tipes utilizados en la funcion clasificarParams 
export type categoriesToSearch = "ciudad" | "barrio" | "universidad" | "tipo" | "amoblado" | "alimentacion" | "arregloRopa" | "bañoPrivado" | "arregloHabitacion" | "genero" | "mascota"


export type finalFilters = {
  group: categoriesToSearch;
  slug: string;
  label: string;
}

type finalResultFromClasificarParams = Partial<Record<categoriesToSearch, finalFilters>>



/**
 * Genera una lista "aplanada" de ciudades colombianas a partir del JSON base.
 * Cada objeto en el array final representa una ciudad junto con su departamento.
 * Se añade un `slug` único que combina el nombre de la ciudad y el departamento.
 * @constant
 * @example
 * Ejemplo de objetos en el array resultante:
 * [
 *   { slug: "leticia-amazonas", label: "Leticia", department: "Amazonas" },
 *   { slug: "puerto-narino-amazonas", label: "Puerto Nariño", department: "Amazonas" }
 * ]
 *
 * @remarks
 * - Se utiliza `flatMap` para recorrer los departamentos y luego mapear sus ciudades.
 * - El `department` se repite intencionalmente en cada objeto para mantener un formato consistente
 *   y permitir búsquedas/filtrado más simples a nivel de ciudad.
 */
const citiesFlatened = colombianCitiesJson.flatMap((dep) =>
  dep.ciudades.map((city) => ({
    slug: `${slugify(city)}-${slugify(dep.departamento)}`,
    label: city,
    department: dep.departamento,
  }))
)





/**
 * Identifica y clasifica los filtros ingresados en la URL según su group correspondiente:
 * tipo de operación, ciudad, barrio o universidad.
 *
 * El orden de prioridad para hacer match es:
 * 1. Tipo de operación (venta, arriendo, etc.)
 * 2. Ciudad
 * 3. Barrio
 * 4. Universidad
 *
 * Solo se permite un match por group. Si un urlFilter ya fue clasificado, se ignora en futuras iteraciones.
 *
 * @param filtros - Array de strings provenientes de los params de la URL, como ["manizales", "arriendo", "palogrande"].
 * @returns Un objeto parcial que puede contener hasta 4 claves (tipo, ciudad, barrio, universidad),
 * cada una con su valor correspondiente del tipo `finalFilters`.
 *
 * El tipo `Partial<Record<categoriesToSearch, finalFilters>>` permite representar de forma segura
 * un conjunto incompleto de resultados de filtros clasificados.
 * 
 * Record quiere decir: Es una utilidad de TypeScript que crea un objeto cuyas claves son del 
 * tipo Clave y cuyos valores son del tipo Valor.
 *
 * 
 * @example
 * identificarFiltros(["manizales", "arriendo", "palogrande"])
 *  {
 *    ciudad: { group: "ciudad", slug: "manizales", label: "Manizales" },
 *    tipo: { group: "tipo", slug: "arriendo", label: "Arriendo" },
 *    barrio: { group: "barrio", slug: "palogrande", label: "Palogrande" }
 *  }
 * 
*/
function clasificarParams(filtros: string[]): Partial<Record<categoriesToSearch, finalFilters>> {
  
  /**
   * Un Set es una colección de valores únicos. Es como un array, pero:
   * - No permite elementos duplicados.
   * - Tiene métodos como .add(), .has(), .delete().
   * - Su propósito es verificar presencia o ausencia rápida de valores.
   * Le estás diciendo a TypeScript que este Set solo va a contener valores de tipo string.
   * (Ej: "manizales", "arriendo", "palogrande"... etc.
  */
  const used = new Set<string>();

  const result: finalResultFromClasificarParams = {}

  filtros.forEach((urlFilter) => {

    if (used.has(urlFilter)) return;

    //Tu código sí tiene una prioridad implícita en el orden en que se buscan los matches:
    /**
    * Eso significa:
    - Primero intenta match con tipo
    - Luego con ciudad
    - Luego con barrio
    - Y por último con universidad
    */
    const matchType = typeOperationJson.find(t => t.slug === urlFilter); //Al menos con esto el slug tiene que ser totalmente exacto
    //Lo que dice este if es que si existe un matchType y el result.tipo esta vacio (osea no existe) entonces se hace la escritura
    if (matchType && !result.tipo) {
      result.tipo = { group: "tipo", slug: matchType.slug, label: matchType.label };
      //La finalidad de este set llamado used es que si el urlFilter ya se proceso entonces se descarta en la proxima iteracion del forEach
      used.add(urlFilter);
      return;
    }

    const matchCity = citiesFlatened.find(c => c.slug === urlFilter);
    if (matchCity && !result.ciudad) {
      result.ciudad = { group: "ciudad", slug: matchCity.slug, label: matchCity.label };
      used.add(urlFilter);
      return;
    }

    const natchNeighbor = neighborhoodJson.find(b => b.slug === urlFilter);
    if (natchNeighbor && !result.barrio) {
      result.barrio = { group: "barrio", slug: natchNeighbor.slug, label: natchNeighbor.nombre };
      used.add(urlFilter);
      return;
    }

    const matchUniversity = universitiesJson.find(u => u.slug === urlFilter);
    if (matchUniversity && !result.universidad) {
      result.universidad = { group: "universidad", slug: matchUniversity.slug, label: matchUniversity.label };
      used.add(urlFilter);
      return;
    }

  const matchFurnished = extraFiltersJson.find(u => (u.slug === urlFilter) && (u.label === "Amoblado" || u.label === "Sin Amoblar"));
    if (matchFurnished && !result.amoblado) {
      result.amoblado = { group: "amoblado", slug: matchFurnished.slug, label: matchFurnished.label };
      used.add(urlFilter);
      
      return;
    }

    

    const matchAlimentacion = extraFiltersJson.find(u => u.slug === urlFilter && (u.label === "Con Alimentacion" || u.label === "Sin Alimentacion"));
    if (matchAlimentacion && !result.alimentacion) {
      result.alimentacion = { group: "alimentacion", slug: matchAlimentacion.slug, label: matchAlimentacion.label };
      used.add(urlFilter);
      
      return;
    }



    const matchArregloRopa = extraFiltersJson.find(u => u.slug === urlFilter && (u.label === "Con Arreglo de Ropa" || u.label === "Sin Arreglo de Ropa"));
    if (matchArregloRopa && !result.arregloRopa) {
      result.arregloRopa = { group: "arregloRopa", slug: matchArregloRopa.slug, label: matchArregloRopa.label };
      used.add(urlFilter);
      return;
    }

  
    const matchBañoPrivado = extraFiltersJson.find(u => u.slug === urlFilter && (u.label === "Con Baño Privado" || u.label === "Sin Baño Privado"));
    if (matchBañoPrivado && !result.bañoPrivado) {
      result.bañoPrivado = { group: "bañoPrivado", slug: matchBañoPrivado.slug, label: matchBañoPrivado.label };
      used.add(urlFilter);
      return;
    }



    const matchArregloHabitacon = extraFiltersJson.find(u => u.slug === urlFilter && (u.label === "Arreglo de Habitacion" || u.label === "Sin Arreglo de Habitacion"));
    if (matchArregloHabitacon && !result.arregloHabitacion) {
      result.arregloHabitacion = { group: "arregloHabitacion", slug: matchArregloHabitacon.slug, label: matchArregloHabitacon.label };
      used.add(urlFilter);
      return;
    }

    const matchGenero = extraFiltersJson.find(u => u.slug === urlFilter && (u.label === "Solo Hombres" || u.label === "Solo Mujeres" || u.label === "Mixto"));
    if (matchGenero && !result.genero) {
      result.genero = { group: "genero", slug: matchGenero.slug, label: matchGenero.label };
      used.add(urlFilter);
      return;
    }

    const matchMascota = extraFiltersJson.find(u => u.slug === urlFilter && (u.label === "GATOS" || u.label === "PERROS PEQUEÑOS" || u.label === "PERROS GRANDES" || u.label === "NO SE PERMITEN MASCOTAS"));
    if (matchMascota && !result.genero) {
      result.genero = { group: "mascota", slug: matchMascota.slug, label: matchMascota.label };
      used.add(urlFilter);
      return;
    }
    
  });


  
  return result;
}




/**
 * 
 * @param children - Representa el page.tsx
 * @param params - Es el array de la url.
 * 
 *
 * @returns el respectivo page con los hijos y sus respectivos states
*/
export default async function ExploreLayout({children, params}:{params: Promise<{ filtros: string[] }>, children: React.ReactNode}) {

  const urlFilters = (await params).filtros || [];
 
  

  const paramsClasificados = (clasificarParams(urlFilters))
  console.log(paramsClasificados)
  /*
  OJO, EL PRIMER RENDER AL MONTAR EL COMPONENTE ES EN EL SERVIDOR, EL RESTO ES EN EL CLIENTE CUANDO SE USA "USE CLIENT"
    if (typeof window !== "undefined") {
      console.log("Ciudad cambió en el CLIENTE:", city);
    } else {
      console.log("Ciudad cambió en el SERVIDOR:", city);
    }
  */


  return (
    <section>
      <div className="flex items-center justify-between border-2 border-amber-800 h-60">

        <div>
          <BreadcrumbWithCustomSeparator paramsClasificados={paramsClasificados} />
          
          <div>
            este es el div del mensaje de donde esta la busqueda actualmente
          </div>

          <h1>Parámetros de la URL:</h1>
          <ul>
            {Object.values(paramsClasificados).map((item, index) => (
              <li key={index}>
                {index + 1}. {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-10 items-center">

          <div>

            <SearchType
              urlFilters={urlFilters} 
              paramsClasificados = {paramsClasificados} 
              tipodeArriendo={typeOperationJson}>
            </SearchType>

            <div className="flex">

              <SearchCity 
                urlFilters={urlFilters} 
                paramsClasificados = {paramsClasificados} 
                ciudades={citiesFlatened}>
              </SearchCity>

              <SearchNeightbor 
                urlFilters={urlFilters} 
                paramsClasificados = {paramsClasificados} 
                barriosdeColombiaJson={neighborhoodJson}>
              </SearchNeightbor>

            </div>

            <SearchUniversity
              urlFilters={urlFilters} 
              paramsClasificados = {paramsClasificados} 
              universidadesdeColombiaJson={universitiesJson}>
            </SearchUniversity>

          </div>

          
          <FiltersDrawer
            urlFilters={urlFilters}
            paramsClasificados = {paramsClasificados}
            
            >
          </FiltersDrawer>
          
          

        </div>

      </div>

      {children}
    </section>
  );
}
