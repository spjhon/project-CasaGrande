"use client";

//importe del usestate
import { useState } from "react";

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"

import {actualizarFiltros, actualizarFiltrosGenero} from "@/lib/utils"

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
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout";
import { FourStateComponent } from "./drawerFilters/FourStateComponent";





//Tipos utilizados en el state del primer filtro ya que sino typescript inferiria que el state inicial es solo un string y no un array
type FiltrosState = "Todos" | "Si" | "No";
type GeneroTypeState =  "todos" | "solo-hombres" | "solo-mujeres" | "mixto";
type Direction = "prev" | "next";

//Constante utilizada para saber los diferentes states y hacer las respectivas comparaciones
const estados: FiltrosState[] = ["Todos", "Si", "No"];
const estadosGenero: GeneroTypeState[] = ["todos", "solo-mujeres", "solo-hombres", "mixto"];

type TipodeArriendoSearchProps = {
  filtros?: string[];
  paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
};






/**
 * Función genérica para controlar los botones +/-
 * @param current El estado actual (ej: amoblado, alimentacion, etc.)
 * @param setState La función setState correspondiente
 * @param direction La dirección "prev" o "next"
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



//FUNCIONES PARA OBTENER LOS STATES INICIALES QUE VIENEN DESDE LA URL DEL LAYOUT

function getEstadoInicial(
  slug: string | undefined,
  opciones: { si: string; no: string }
): FiltrosState {
  if (slug === opciones.si) return "Si";
  if (slug === opciones.no) return "No";
  return "Todos";
}


function getGeneroInicial(slug: string | undefined): GeneroTypeState {
if (slug === "solo-hombres" || slug === "solo-mujeres" || slug === "mixto") {
  return slug;
}
return "todos"; // valor por defecto
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
  filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  }: TipodeArriendoSearchProps) {


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

  //DEFINICION DE STATES
  const [amoblado, setAmoblado] = useState<FiltrosState>(amobladoEstadoInicial);
  const [alimentacion, setAlimentacion] = useState<FiltrosState>(alimentacionEstadoInicial);
  const [arregloRopa, setArregloRopa] = useState<FiltrosState>(arregloRopaEstadoInicial);
  const [bañoPrivado, setBañoPrivado] = useState<FiltrosState>(bañoPrivadoEstadoInicial);
  const [arregloHabitacion, setArregloHabitacion] = useState<FiltrosState>(arregloHabitacionEstadoInicial);
  const [genero, setGenero] = useState<GeneroTypeState>(generoEstadoInicial);

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
    let newFiltros = [...(filtros || [])];

    // Aplicar filtros regulares
    newFiltros = actualizarFiltros(amoblado, paramsClasificados?.amoblado?.slug, FILTERS_CONFIG.amoblado, newFiltros);
    newFiltros = actualizarFiltros(alimentacion, paramsClasificados?.alimentacion?.slug, FILTERS_CONFIG.alimentacion, newFiltros);
    newFiltros = actualizarFiltros(arregloRopa, paramsClasificados?.arregloRopa?.slug, FILTERS_CONFIG.arregloRopa, newFiltros);
    newFiltros = actualizarFiltros(bañoPrivado, paramsClasificados?.bañoPrivado?.slug, FILTERS_CONFIG.bañoPrivado, newFiltros);
    newFiltros = actualizarFiltros(arregloHabitacion, paramsClasificados?.arregloHabitacion?.slug, FILTERS_CONFIG.arregloHabitacion, newFiltros);
    
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

        <div className="mx-auto w-full max-w-sm">

          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>Personaliza tu búsqueda.</DrawerDescription>
          </DrawerHeader>


          <TriStateComponent onClick={onClickAmoblado} goal={amoblado} label="CUARTO AMOBLADO"/>  
          <TriStateComponent onClick={onClickAlimentacion} goal={alimentacion} label="ALIMENTACION"/>  
          <TriStateComponent onClick={onClickArregloRopa} goal={arregloRopa} label="ARREGLO DE ROPA"/>  
          <TriStateComponent onClick={onClickBañoPrivado} goal={bañoPrivado} label="BAÑO PRIVADO"/>  
          <TriStateComponent onClick={onClickArregloHabitacion} goal={arregloHabitacion} label="ARREGLO DE HABITACION"/>  
          <FourStateComponent onClick={onClickGenero} goal={genero} label="GENERO"/>  

          
          <DrawerFooter>
            <Button onClick={handleSubmit}>Aplicar Filtros</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>


        </div>

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