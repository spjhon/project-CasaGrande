"use client";

//Importe del useReducer en lugar de useState para mejor manejo del estado
import { useReducer } from "react";

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"

import {actualizarFiltros} from "@/lib/utils"

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

//Tipos utilizados para el estado de los filtros y direcciones de navegación
type FiltrosState = "Todos" | "Si" | "No";
type Direction = "prev" | "next";

//Tipos para el filtro específico que se va a actualizar
type FilterType = "amoblado" | "alimentacion" | "arregloRopa" | "bañoPrivado" | "arregloHabitacion";

//Constante utilizada para saber los diferentes states y hacer las respectivas comparaciones
const estados: FiltrosState[] = ["Todos", "Si", "No"];

//Estado inicial del reducer con todos los filtros
interface FiltersState {
  amoblado: FiltrosState;
  alimentacion: FiltrosState;
  arregloRopa: FiltrosState;
  bañoPrivado: FiltrosState;
  arregloHabitacion: FiltrosState;
  open: boolean;
}

//Tipos de acciones que puede realizar el reducer
type FilterAction = 
  | { type: 'CHANGE_FILTER'; filterType: FilterType; direction: Direction }
  | { type: 'SET_OPEN'; open: boolean }
  | { type: 'INITIALIZE_FILTERS'; filters: Omit<FiltersState, 'open'> };

type TipodeArriendoSearchProps = {
    filtros?: string[];
    paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
};

/**
 * Función genérica para controlar los botones +/- y obtener el siguiente estado
 * @param current El estado actual (ej: amoblado, alimentacion, etc.)
 * @param direction La dirección "prev" o "next"
 * @returns El nuevo estado después del cambio
 */
function getNextState(current: FiltrosState, direction: Direction): FiltrosState {
  const index = estados.indexOf(current);

  if (direction === "next" && index < estados.length - 1) {
    return estados[index + 1];
  }

  if (direction === "prev" && index > 0) {
    return estados[index - 1];
  }

  return current; // No hay cambio si está en los límites
}

/**
 * Función para obtener el estado inicial de un filtro basado en su slug
 * @param slug El slug actual del parámetro
 * @param opciones Las opciones de si y no para el filtro
 * @returns El estado inicial del filtro
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
 * Reducer para manejar el estado de todos los filtros de manera centralizada
 * @param state Estado actual de todos los filtros
 * @param action Acción a realizar (cambiar filtro, abrir/cerrar drawer, etc.)
 * @returns Nuevo estado después de aplicar la acción
 */
function filtersReducer(state: FiltersState, action: FilterAction): FiltersState {
  switch (action.type) {
    case 'CHANGE_FILTER':
      return {
        ...state,
        [action.filterType]: getNextState(state[action.filterType], action.direction)
      };
    
    case 'SET_OPEN':
      return {
        ...state,
        open: action.open
      };
    
    case 'INITIALIZE_FILTERS':
      return {
        ...state,
        ...action.filters
      };
    
    default:
      return state;
  }
}

/**
 * Función para crear el estado inicial del reducer basado en los parámetros clasificados
 * @param paramsClasificados Los parámetros actuales de la URL
 * @returns Estado inicial para el reducer
 */
function createInitialState(paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>): FiltersState {
  return {
    amoblado: getEstadoInicial(paramsClasificados?.amoblado?.slug, {
      si: "amoblado",
      no: "sin-amoblado",
    }),
    alimentacion: getEstadoInicial(paramsClasificados?.alimentacion?.slug, {
      si: "con-alimentacion",
      no: "sin-alimentacion",
    }),
    arregloRopa: getEstadoInicial(paramsClasificados?.arregloRopa?.slug, {
      si: "con-arreglo-ropa",
      no: "sin-arreglo-ropa",
    }),
    bañoPrivado: getEstadoInicial(paramsClasificados?.bañoPrivado?.slug, {
      si: "con-bano-privado",
      no: "sin-bano-privado",
    }),
    arregloHabitacion: getEstadoInicial(paramsClasificados?.arregloHabitacion?.slug, {
      si: "arreglo-habitacion",
      no: "sin-arreglo-habitacion",
    }),
    open: false
  };
}

/**
 * Componente principal del drawer de filtros
 * @returns Retorna el drawer con todos sus hijos que son filtros y con el boton de submit que le da un .push() a la url
*/
export function FiltersDrawer({ 
  filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
}: TipodeArriendoSearchProps) {

  const router = useRouter();
  
  //Inicialización del reducer con el estado inicial basado en los parámetros de la URL
  const [state, dispatch] = useReducer(filtersReducer, createInitialState(paramsClasificados));

  //Funciones de conveniencia para cambiar cada filtro específico
  const onClickAmoblado = (direction: Direction) => {
    dispatch({ type: 'CHANGE_FILTER', filterType: 'amoblado', direction });
  };

  const onClickAlimentacion = (direction: Direction) => {
    dispatch({ type: 'CHANGE_FILTER', filterType: 'alimentacion', direction });
  };

  const onClickArregloRopa = (direction: Direction) => {
    dispatch({ type: 'CHANGE_FILTER', filterType: 'arregloRopa', direction });
  };

  const onClickBañoPrivado = (direction: Direction) => {
    dispatch({ type: 'CHANGE_FILTER', filterType: 'bañoPrivado', direction });
  };

  const onClickArregloHabitacion = (direction: Direction) => {
    dispatch({ type: 'CHANGE_FILTER', filterType: 'arregloHabitacion', direction });
  };

  /**
   * Función para manejar el submit del formulario de filtros
   * Construye la nueva URL basada en el estado actual de los filtros y navega a ella
   */
  const handleSubmit = () => {
    //Obtener los slugs actuales de los parámetros para comparación
    const amobladoSlugActual = paramsClasificados?.amoblado?.slug;
    const alimentacionSlugActual = paramsClasificados?.alimentacion?.slug;
    const arregloRopaSlugActual = paramsClasificados?.arregloRopa?.slug;
    const bañoPrivadoSlugActual = paramsClasificados?.bañoPrivado?.slug;
    const arregloHabitacionSlugActual = paramsClasificados?.arregloHabitacion?.slug;

    let newFiltros = [...(filtros || [])];

    // Aplicar función utilitaria para cada filtro usando el estado del reducer
    newFiltros = actualizarFiltros(state.amoblado, amobladoSlugActual, {
      Si: "amoblado",
      No: "sin-amoblado",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(state.alimentacion, alimentacionSlugActual, {
      Si: "con-alimentacion",
      No: "sin-alimentacion",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(state.arregloRopa, arregloRopaSlugActual, {
      Si: "con-arreglo-ropa",
      No: "sin-arreglo-ropa",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(state.bañoPrivado, bañoPrivadoSlugActual, {
      Si: "con-bano-privado",
      No: "sin-bano-privado",
      Todos: null,
    }, newFiltros);

    newFiltros = actualizarFiltros(state.arregloHabitacion, arregloHabitacionSlugActual, {
      Si: "arreglo-habitacion",
      No: "sin-arreglo-habitacion",
      Todos: null,
    }, newFiltros);

    //Cerrar el drawer después de aplicar los filtros
    dispatch({ type: 'SET_OPEN', open: false });

    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
  };

  return (
    <Drawer open={state.open} onOpenChange={(open) => dispatch({ type: 'SET_OPEN', open })}>
      <DrawerTrigger asChild>
        <Button variant="outline">+ Filtros</Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>Personaliza tu búsqueda.</DrawerDescription>
          </DrawerHeader>

          {/* Componentes de filtro usando el estado del reducer */}
          <TriStateComponent onClick={onClickAmoblado} goal={state.amoblado} label="CUARTO AMOBLADO"/>  
          <TriStateComponent onClick={onClickAlimentacion} goal={state.alimentacion} label="ALIMENTACION"/>  
          <TriStateComponent onClick={onClickArregloRopa} goal={state.arregloRopa} label="ARREGLO DE ROPA"/>  
          <TriStateComponent onClick={onClickBañoPrivado} goal={state.bañoPrivado} label="BAÑO PRIVADO"/>  
          <TriStateComponent onClick={onClickArregloHabitacion} goal={state.arregloHabitacion} label="ARREGLO DE HABITACION"/>  

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