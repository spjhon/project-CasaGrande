"use client";

//importe del usestate
import { useState } from "react";

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"

//Importacion de funciones utilitarias
import {updateURLFromFilters, actualizarFiltrosGenero, actualizarFiltrosMascota, onClickEstado, onClickEstadoGenero, getEstadoInicial, getGeneroInicial, getPetInicial, getContratoInicial, actualizarFiltrosContratos, getEstratoInicial, actualizarFiltrosEstrato, actualizarFiltrosPrecioMinimo, actualizarFiltrosPrecioMaximo, contarFiltrosExtras, FILTERS_CONFIG} from "@/lib/utilsFiltersDrawer"

//importe de primitivos
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
 
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";


import { SlidersHorizontalIcon } from "lucide-react";

//Importe de componentes que son los diferentes filtros extra
import { YesNoSelect } from "./drawerFilters/YesNoSelect";
import { GenreSelect } from "./drawerFilters/GenreSelect";
import { PetSelect } from "./drawerFilters/PetSelect";
import { MinTimeSelect } from './drawerFilters/MinTimeSelect';

//Importaciones de types que vienen desde layout
import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout";
import { EstratoSelect } from "./drawerFilters/EstratoSelect";
import { PriceRangeSelect } from "./drawerFilters/PriceRangeSelect";


//Tipos utilizados en el state del primer filtro ya que sino typescript inferiria que el state inicial es solo un string y no un array
export type FiltrosState = "Todos" | "Si" | "No";
export type Direction = "prev" | "next";
export type GeneroTypeState =  "todos" | "solo-hombres" | "solo-mujeres" | "mixto";
export type PetTypeState = "gatos" | "perros-pequenos" | "perros-grandes" | "sin-mascotas" | null;
export type ContractTypeState = "tiempo-minimo-1-mes" | "tiempo-minimo-3-meses" | "tiempo-minimo-6-meses" | "tiempo-minimo-1-ano" | null;
export type EstratoTypeState = "estrato-1" | "estrato-2" | "estrato-3" | "estrato-4" | "estrato-5" | "estrato-6" | null;
export type PrecioMinimoTypeState = "precio-minimo-" |  null;
export type PrecioMaximoTypeState = "precio-maximo-" |  null;



type FiltersDrawerProps = {
  urlFilters?: string[];
  paramsClasificados?: finalResultFromClasificarParams;
};


/**
 * 
 * @returns Retorna el drawer con todos sus hijos que son filtros y con el boton de submit que le da un .push() a la url
*/
export function FiltersDrawer({ 
  urlFilters = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  }: FiltersDrawerProps) {


  const router = useRouter();

  //Cantidad de filtros del drawer para poder contar cuandos hay seleccionados en el drawer
  const QuantityOfDrawerFiltersFromParamsClasificados = paramsClasificados? contarFiltrosExtras(paramsClasificados) : 0



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

  const contratoMinimoEstadoInicial = getContratoInicial(paramsClasificados?.tiempoContratoMinimo?.slug)

  const estratoEstadoInicial = getEstratoInicial(paramsClasificados?.estrato?.slug)

  const precioMinimoInicial = paramsClasificados?.minPrice?.value ?? null
  const precioMaximoInicial = paramsClasificados?.maxPrice?.value ?? null




  //DEFINICION DE STATES
  const [amoblado, setAmoblado] = useState<FiltrosState>(amobladoEstadoInicial);
  const [alimentacion, setAlimentacion] = useState<FiltrosState>(alimentacionEstadoInicial);
  const [arregloRopa, setArregloRopa] = useState<FiltrosState>(arregloRopaEstadoInicial);
  const [bañoPrivado, setBañoPrivado] = useState<FiltrosState>(bañoPrivadoEstadoInicial);
  const [arregloHabitacion, setArregloHabitacion] = useState<FiltrosState>(arregloHabitacionEstadoInicial);
  const [genero, setGenero] = useState<GeneroTypeState>(generoEstadoInicial);
  const [selectedPet, setSelectedPet] = useState<PetTypeState>(mascotaEstadoInicial)
  const [contract, setContract] = useState(contratoMinimoEstadoInicial)
  const [estrato, setEstrato] = useState(estratoEstadoInicial)
  const [minPrice, setMinPrice] = useState<number | null>(precioMinimoInicial ?? 0)
  const [maxPrice, setMaxPrice] = useState<number | null>(precioMaximoInicial ?? 0)


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






  //FUNCION QUE SE ENCARGA DE COGER LOS FILTROS Y ORGANIZARLOS PARA HACER EL PUSH FINAL A LA URL UNA VEZ QUE EL USUARIO 
  //APRETA EL BOTON SUBMIT
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

    // Filtro especial para las mascotas
    newFiltros = actualizarFiltrosMascota(selectedPet, paramsClasificados?.mascota?.slug, newFiltros);

    // Filtro especial para los tiempos minimos de contratos
    newFiltros = actualizarFiltrosContratos(contract, paramsClasificados?.tiempoContratoMinimo?.slug, newFiltros);

    // Filtro especial para la seleccion de los estratos
    newFiltros = actualizarFiltrosEstrato(estrato, paramsClasificados?.estrato?.slug, newFiltros);

    // Filtro especial para la seleccion de los precios
    if (minPrice !== null && maxPrice !== null ) {

      if (minPrice > maxPrice) {
        newFiltros = actualizarFiltrosPrecioMinimo(maxPrice, newFiltros);
        newFiltros = actualizarFiltrosPrecioMaximo(minPrice, newFiltros);
      }else{
        newFiltros = actualizarFiltrosPrecioMinimo(minPrice, newFiltros);
        newFiltros = actualizarFiltrosPrecioMaximo(maxPrice, newFiltros);
      }
    }
    

    setOpen(false);
    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
  };




const handleReset = () => {

  // Reset de todos los filtros al estado inicial
  setAmoblado("Todos");
  setAlimentacion("Todos");
  setArregloRopa("Todos");
  setBañoPrivado("Todos");
  setArregloHabitacion("Todos");
  setGenero("todos");
  setSelectedPet(null);
  setContract(null);
  setEstrato(null);
  setMinPrice(0);
  setMaxPrice(0);

};

  return (
    <Drawer open={open} onOpenChange={setOpen}>


      <DrawerTrigger asChild >
        <Button className="font-bold" variant="outline" >
          <SlidersHorizontalIcon></SlidersHorizontalIcon>
          Comodidades | {`${QuantityOfDrawerFiltersFromParamsClasificados}`} Seleccionados
        </Button>
      </DrawerTrigger>


      <DrawerContent className="min-h-screen md:min-h-[80%]">
        

        <DrawerHeader>
          <DrawerTitle>Personaliza tu búsqueda.</DrawerTitle>
        </DrawerHeader>


        <div className="flex overflow-y-auto flex-wrap">

          <div className="mx-auto w-full max-w-sm order-3 md:order-1"> 
            <MinTimeSelect contract={contract} setContract={setContract}/>
            <EstratoSelect estrato={estrato} setEstrato={setEstrato} /> 
            <PriceRangeSelect minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} /> 
          </div>

          <div className="mx-auto w-full max-w-sm order-1 md:order-2">
            <YesNoSelect onClick={onClickAmoblado} goal={amoblado} label="CUARTO AMOBLADO"/>  
            <YesNoSelect onClick={onClickAlimentacion} goal={alimentacion} label="ALIMENTACION"/> 
            <YesNoSelect onClick={onClickBañoPrivado} goal={bañoPrivado} label="BAÑO PRIVADO"/> 
            <YesNoSelect onClick={onClickArregloRopa} goal={arregloRopa} label="ARREGLO DE ROPA"/>  
            <YesNoSelect onClick={onClickArregloHabitacion} goal={arregloHabitacion} label="ARREGLO DE HABITACION"/>  
          </div> 

          <div className="mx-auto w-full max-w-sm order-2 md:order-3">
            <GenreSelect onClick={onClickGenero} goal={genero} label="GENERO"/>  
            <PetSelect selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
          </div>
        </div>
      


        <DrawerFooter className="mx-auto w-full justify-center my-auto flex-wrap">
          <Button className="w-100" onClick={handleReset}>Resetear Filtros</Button>
          <Button className="w-100" onClick={handleSubmit}>Aplicar Filtros</Button>
          <DrawerClose asChild>
            <Button className="w-100" variant="outline">Cancel</Button>
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