"use client";

//importe del usestate
import { useState } from "react";

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"

//Importacion de funciones utilitarias
import {updateURLFromFilters, actualizarFiltrosGenero} from "@/lib/utils"

//importe de primitivos
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

//Importe de componentes que son los diferentes filtros extra
import { TriStateComponent } from "./drawerFilters/TriStateComponent";
import { categoriesToSearch, finalFilters } from "@/app/[locale]/explore/[[...filtros]]/layout";
import { FourStateComponent } from "./drawerFilters/FourStateComponent";
import { PetSelect } from "./drawerFilters/PetSelect";



//Tipos utilizados en el state del primer filtro ya que sino typescript inferiria que el state inicial es solo un string y no un array
type FiltrosState = "Todos" | "Si" | "No";
type GeneroTypeState =  "todos" | "solo-hombres" | "solo-mujeres" | "mixto";
type Direction = "prev" | "next";

//Diferentes tipos de estados que puede tener selectedPets, que es el useState de este componente
type PetTypeState = "gatos" | "perros-pequenos" | "perros-grandes" | null;

//Constante utilizada para saber los diferentes states y hacer las respectivas comparaciones
const estados: FiltrosState[] = ["Todos", "Si", "No"];
const estadosGenero: GeneroTypeState[] = ["todos", "solo-mujeres", "solo-hombres", "mixto"];

type FiltersDrawerProps = {
  urlFilters?: string[];
  paramsClasificados?: Partial<Record<categoriesToSearch, finalFilters>>;
};






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
function onClickEstado(
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
function onClickEstadoGenero(
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
function getEstadoInicial(
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
function getGeneroInicial(slug: string | undefined): GeneroTypeState {
if (slug === "solo-hombres" || slug === "solo-mujeres" || slug === "mixto") {
  return slug;
}
return "todos"; // valor por defecto
}



function getPetInicial(slug: string | undefined): PetTypeState {
if (slug === "gatos" || slug === "perros-pequenos" || slug === "perros-grandes") {
  return slug;
}
return null; // valor por defecto
}


// Primero, definir la configuración de filtros fuera del componente
const FILTERS_CONFIG = {
  amoblado: { Si: "amoblado", No: "sin-amoblado", Todos: null },
  alimentacion: { Si: "con-alimentacion", No: "sin-alimentacion", Todos: null },
  arregloRopa: { Si: "con-arreglo-ropa", No: "sin-arreglo-ropa", Todos: null },
  bañoPrivado: { Si: "con-bano-privado", No: "sin-bano-privado", Todos: null },
  arregloHabitacion: { Si: "arreglo-habitacion", No: "sin-arreglo-habitacion", Todos: null },
} as const;


/**
 * 
 * @returns Retorna el drawer con todos sus hijos que son filtros y con el boton de submit que le da un .push() a la url
*/
export function FiltersDrawer({ 
  urlFilters = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  }: FiltersDrawerProps) {


  const router = useRouter();





  //OBTENCION DE LOS ESTADOS INICIALES
  const amobladoEstadoInicial = getEstadoInicial(paramsClasificados?.amoblado?.slug, {
    si: FILTERS_CONFIG.amoblado.Si,
    no: FILTERS_CONFIG.amoblado.No,
  });

  const alimentacionEstadoInicial = getEstadoInicial(paramsClasificados?.alimentacion?.slug, {
    si: FILTERS_CONFIG.alimentacion.Si,
    no: FILTERS_CONFIG.alimentacion.No,
  });

  const arregloRopaEstadoInicial = getEstadoInicial(paramsClasificados?.arregloRopa?.slug, {
    si: FILTERS_CONFIG.arregloRopa.Si,
    no: FILTERS_CONFIG.arregloRopa.No,
  });

  const bañoPrivadoEstadoInicial = getEstadoInicial(paramsClasificados?.bañoPrivado?.slug, {
    si: FILTERS_CONFIG.bañoPrivado.Si,
    no: FILTERS_CONFIG.bañoPrivado.No,
  });

  const arregloHabitacionEstadoInicial = getEstadoInicial(paramsClasificados?.arregloHabitacion?.slug, {
    si: FILTERS_CONFIG.arregloHabitacion.Si,
    no: FILTERS_CONFIG.arregloHabitacion.No,
  });

  const generoEstadoInicial = getGeneroInicial(paramsClasificados?.genero?.slug)

  const mascotaEstadoInicial = getPetInicial(paramsClasificados?.mascota?.slug)

  //DEFINICION DE STATES
  const [amoblado, setAmoblado] = useState<FiltrosState>(amobladoEstadoInicial);
  const [alimentacion, setAlimentacion] = useState<FiltrosState>(alimentacionEstadoInicial);
  const [arregloRopa, setArregloRopa] = useState<FiltrosState>(arregloRopaEstadoInicial);
  const [bañoPrivado, setBañoPrivado] = useState<FiltrosState>(bañoPrivadoEstadoInicial);
  const [arregloHabitacion, setArregloHabitacion] = useState<FiltrosState>(arregloHabitacionEstadoInicial);
  const [genero, setGenero] = useState<GeneroTypeState>(generoEstadoInicial);
  const [selectedPets, setSelectedPets] = useState<PetTypeState[]>([mascotaEstadoInicial])

  
  //Este es el state para abrir y cerrar el dropdown
  const [open, setOpen] = useState(false)


  // Esta función es la que vas a pasar como prop la cual crea funciones personalizadas utilizando una funcion generica
  //con el fin de enviar las funciones set y el state a los hijos
  const onClickAmoblado = (direction: Direction) => {
    onClickEstado(amoblado, setAmoblado, direction);
  };
  
  const onClickAlimentacion = (direction: Direction) => {
    onClickEstado(alimentacion, setAlimentacion, direction);
  };

  const onClickArregloRopa = (direction: Direction) => {
    onClickEstado(arregloRopa, setArregloRopa, direction);
  };


  const onClickBañoPrivado = (direction: Direction) => {
    onClickEstado(bañoPrivado, setBañoPrivado, direction);
  };

  const onClickArregloHabitacion = (direction: Direction) => {
    onClickEstado(arregloHabitacion, setArregloHabitacion, direction);
  };

  const onClickGenero = (direction: Direction) => {
    onClickEstadoGenero(genero, setGenero, direction);
  };






  //FUNCION QUE SE ENCARGA DE COGER LOS FILTROS Y ORGANIZARLOS PARA HACER EL PUSH FINAL A LA URL
  // Versión refactorizada simple
  const handleSubmit = () => {
    let newFiltros = [...(urlFilters || [])];

    // Aplicar filtros regulares
    newFiltros = updateURLFromFilters(amoblado, paramsClasificados?.amoblado?.slug, FILTERS_CONFIG.amoblado, newFiltros);
    newFiltros = updateURLFromFilters(alimentacion, paramsClasificados?.alimentacion?.slug, FILTERS_CONFIG.alimentacion, newFiltros);
    newFiltros = updateURLFromFilters(arregloRopa, paramsClasificados?.arregloRopa?.slug, FILTERS_CONFIG.arregloRopa, newFiltros);
    newFiltros = updateURLFromFilters(bañoPrivado, paramsClasificados?.bañoPrivado?.slug, FILTERS_CONFIG.bañoPrivado, newFiltros);
    newFiltros = updateURLFromFilters(arregloHabitacion, paramsClasificados?.arregloHabitacion?.slug, FILTERS_CONFIG.arregloHabitacion, newFiltros);
    
    // Filtro especial de género
    newFiltros = actualizarFiltrosGenero(genero, paramsClasificados?.genero?.slug, newFiltros);

    setOpen(false);
    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
  };






  return (
    <Drawer open={open} onOpenChange={setOpen}>


      <DrawerTrigger asChild >
        <Button variant="outline" >+ Filtros</Button>
      </DrawerTrigger>


      <DrawerContent>
        

        <DrawerHeader>
          <DrawerTitle>Filtros</DrawerTitle>
          <DrawerDescription>Personaliza tu búsqueda.</DrawerDescription>
        </DrawerHeader>


        <div className="flex overflow-y-auto flex-wrap">

          <div className="mx-auto w-full max-w-sm">
            <FourStateComponent onClick={onClickGenero} goal={genero} label="GENERO"/>  
          </div>

          <div className="mx-auto w-full max-w-sm">
            <TriStateComponent onClick={onClickAmoblado} goal={amoblado} label="CUARTO AMOBLADO"/>  
            <TriStateComponent onClick={onClickAlimentacion} goal={alimentacion} label="ALIMENTACION"/>  
            <TriStateComponent onClick={onClickArregloRopa} goal={arregloRopa} label="ARREGLO DE ROPA"/>  
            <TriStateComponent onClick={onClickBañoPrivado} goal={bañoPrivado} label="BAÑO PRIVADO"/>  
            <TriStateComponent onClick={onClickArregloHabitacion} goal={arregloHabitacion} label="ARREGLO DE HABITACION"/>  
          </div> 

          <div className="mx-auto w-full max-w-sm">
            <FourStateComponent onClick={onClickGenero} goal={genero} label="GENERO"/>  
            <PetSelect />
          </div>

        </div>       


        <DrawerFooter className="mx-auto w-full max-w-sm">
          <Button onClick={handleSubmit}>Aplicar Filtros</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
        

      </DrawerContent>

    </Drawer>
  );
}
















//VERSION ANTIGUA DE HANDLESUBMIT
/** 
const handleSubmit = () => {
    const amobladoSlugActual = paramsClasificados?.amoblado?.slug;
    const alimentacionSlugActual = paramsClasificados?.alimentacion?.slug;
    const arregloRopaSlugActual = paramsClasificados?.arregloRopa?.slug;
    const bañoPrivadoSlugActual = paramsClasificados?.bañoPrivado?.slug;
    const arregloHabitacionSlugActual = paramsClasificados?.arregloHabitacion?.slug;
    const generoSlugActual = paramsClasificados?.genero?.slug;


    let newFiltros = [...(filtros || [])];

    // aplicar utilitaria para cada filtro
    newFiltros = actualizarFiltros(amoblado, amobladoSlugActual, {
      Si: "amoblado",
      No: "sin-amoblado",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(alimentacion, alimentacionSlugActual, {
      Si: "con-alimentacion",
      No: "sin-alimentacion",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(arregloRopa, arregloRopaSlugActual, {
      Si: "con-arreglo-ropa",
      No: "sin-arreglo-ropa",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(bañoPrivado, bañoPrivadoSlugActual, {
        Si: "con-bano-privado",
        No: "sin-bano-privado",
        Todos: null,
      }, newFiltros);

    newFiltros = actualizarFiltros(arregloHabitacion, arregloHabitacionSlugActual, {
      Si: "arreglo-habitacion",
      No: "sin-arreglo-habitacion",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltrosGenero(genero, generoSlugActual, newFiltros);


    setOpen(false);

    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
  };
  */