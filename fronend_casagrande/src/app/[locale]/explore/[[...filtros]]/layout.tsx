

//Importacion de componentes
import {CitySearch} from "@/components/CitySearch";
import { BreadcrumbWithCustomSeparator } from "../../../../components/Breadcrumb";


//Importacion de utilidades de react


/*Importacion de fuse
import Fuse from "fuse.js"*/



//Importaciones del json
import ciudadesColombia from "@/data/ciudades.json"
/** Tipos llegan con esta estructura
 * {"id":1,"tipo":"Habitacion Estudiantil Familiar","slug":"arriendo-habitacion-estudiantil-familiar"},*/
import tipoOperacion from "@/data/tipos.json"
//Los barrios llegan con esta estructura
/*{"id": "1","nombre": "Palogrande","slug": "palogrande","ciudad": "Manizales","departamento": "Caldas"},*/
import barrios from "@/data/barrios.json"
/**
 * Universidades llegan con esta estructura
 * {"id": "1",
    "nombre": "Universidad de Caldas - Sede Central",
    "slug": "universidad-de-caldas-sede-central",
    "tipo": "Pública",
    "ciudad": "Manizales",
    "departamento": "Caldas",
    "universidad": "Universidad de Caldas"
  },
 */
import universidades from "@/data/universidades_manziales.json"

//Importacion de funciones utilitarias
import { slugify } from "@/lib/utils";

/**
 * Este va a ser un componente que va a recopilar la url, la va a parsear y enviar los repectivos states a todos los hijos
 * los 6 niveles de la url es:
 * explorer(habitaciones)/tipo/ciudad/universidad/barrio
 * y para las propiedades será explorer(habitaciones)/slug-de-la-habitacion/id
 * y para los user seria explorer(habitaciones)/guest/id
*/




/*estraccion de los datos del json
Explicacion de este flatmap al final de este archivo
La estructura final es algo asi por cada elemento del array final
Object { city: "leticia", label: "Leticia", departamento: "Amazonas" }
Object { city: "puerto nariño", label: "Puerto Nariño", departamento: "Amazonas" }
como se puede observar el departamento esta repetido con el fin de tener un solo object por ciudad con su respectivo deptarta
*/
const ciudades = ciudadesColombia.flatMap((dep) =>
  dep.ciudades.map((ciudad) => ({
    city: slugify(ciudad),
    label: ciudad,
    departamento: dep.departamento,
  }))
)


/* Inicilizacino de fuse
const fuse = new Fuse(ciudades, {
  keys: ["label", "departamento"],
  threshold: 0.3,
})*/



type categoriasAbuscar = "ciudad" | "barrio" | "universidad" | "tipo"

type ResultadoFiltro = {
  grupo: categoriasAbuscar;
  slug: string;
  label: string;
}

/** Este comentario se hizo con chatgpt y la idea es que se describa la mejor forma para crear estos comentarios
 * Identifica y clasifica los filtros ingresados en la URL según su grupo correspondiente:
 * tipo de operación, ciudad, barrio o universidad.
 *
 * El orden de prioridad para hacer match es:
 * 1. Tipo de operación (venta, arriendo, etc.)
 * 2. Ciudad
 * 3. Barrio
 * 4. Universidad
 *
 * Solo se permite un match por grupo. Si un filtro ya fue clasificado, se ignora en futuras iteraciones.
 *
 * @param filtros - Array de strings provenientes de los params de la URL, como ["manizales", "arriendo", "palogrande"].
 * @returns Un objeto parcial que puede contener hasta 4 claves (tipo, ciudad, barrio, universidad),
 * cada una con su valor correspondiente del tipo `ResultadoFiltro`.
 *
 * El tipo `Partial<Record<categoriasAbuscar, ResultadoFiltro>>` permite representar de forma segura
 * un conjunto incompleto de resultados de filtros clasificados.
 * 
 * @example
 * identificarFiltros(["manizales", "arriendo", "palogrande"])
 *  {
 *    ciudad: { grupo: "ciudad", slug: "manizales", label: "Manizales" },
 *    tipo: { grupo: "tipo", slug: "arriendo", label: "Arriendo" },
 *    barrio: { grupo: "barrio", slug: "palogrande", label: "Palogrande" }
 *  }
 * 
*/
function clasificarParams(filtros: string[]): Partial<Record<categoriasAbuscar, ResultadoFiltro>> {
  


  /**
   * Un Set es una colección de valores únicos. Es como un array, pero:
    - No permite elementos duplicados.
    - Tiene métodos como .add(), .has(), .delete().
    - Su propósito es verificar presencia o ausencia rápida de valores.
    Le estás diciendo a TypeScript que este Set solo va a contener valores de tipo string.
  (Ej: "manizales", "arriendo", "palogrande"... etc.
  */
  const usados = new Set<string>();

  const resultado: Partial<Record<categoriasAbuscar, ResultadoFiltro>> = {}

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
 * Extrae los labels (nombres legibles) de un objeto de filtros clasificados.
 *
 * @param clasificados - Objeto parcial que contiene los resultados del parsing de filtros,
 * generado por la función `clasificarParams`.
 * @returns Un array de strings con los labels de cada filtro clasificado.
 *
 * @example
 * const clasificados = clasificarParams(["manizales", "arriendo", "palogrande"]);
 * getLabelsFromFiltros(clasificados);
 *  ["Manizales", "Arriendo", "Palogrande"]
 */
function getLabelsFromFiltros(paramsClasificados: Partial<Record<categoriasAbuscar, ResultadoFiltro>>): string[] {
  return Object.values(paramsClasificados).map((f) => f.label);
}







/**
 * 
 * @param children
 * 
 *
 * @returns el respectivo page con los hijos y sus respectivos states
*/
export default async function ExploreLayout({children, params}:{params: Promise<{ filtros: string[] }>, children: React.ReactNode}) {

  const filtros = (await params).filtros || [];
 

  console.log(clasificarParams(filtros))

  const breadCrumbItems = getLabelsFromFiltros(clasificarParams(filtros))

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
          <BreadcrumbWithCustomSeparator items={breadCrumbItems} />
          
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
          <CitySearch filtros={filtros}></CitySearch>
          
        </div>
      </div>

      {children}
    </section>
  );
}
