"use client";

//importe del usestate
import { useState } from "react";

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
import { FiltroAmoblado } from "./drawerFilters/FiltroAmoblado";
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout";

//Tipos utilizados en el state del primer filtro ya que sino typescript inferiria que el state inicial es solo un string y no un array
type AmobladoState = "Cualquiera" | "Si" | "No";

//Constante utilizada para saber los diferentes states y hacer las respectivas comparaciones
const estados: AmobladoState[] = ["Cualquiera", "Si", "No"];


type tipodeFiltroExtraOption = {
  id: string
  label: string
  slug: string
}


type TipodeArriendoSearchProps = {
    filtros?: string[];
    paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
    filtrosExtraJson?: tipodeFiltroExtraOption[];
};




/**
 * 
 * @returns Retorna el drawer con todos sus hijos que son filtros y con el boton de submit que le da un .push() a la url
 */
export function FiltersDrawer({ 
  filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  filtrosExtraJson = []
}: TipodeArriendoSearchProps) {

  //El state para saber si el usuario escoje ambos, amoblado o sin amoblar
  const [amoblado, setAmoblado] = useState<AmobladoState>("Cualquiera");

  //Este es el state para abrir y cerrar el dropdown
  const [open, setOpen] = useState(false)

  //Funcion que lo que controla los botnes de mas y menos.
  function onClick(direction: "prev" | "next") {

    //Lo que hace es comparar el state actual "amblado" con alguno de los que esta en la variable estados y asi saber el indice
    const index = estados.indexOf(amoblado);

    /**Si la direccion escogida por el usuario que se observa en el parametro de direction es hacia adelante
     */
    if (direction === "next" && index < estados.length - 1) {
      setAmoblado(estados[index + 1]);
    }
    if (direction === "prev" && index > 0) {
      setAmoblado(estados[index - 1]);
    }
  }






  const handleSubmit = () => {
    const tipoSlugActual = paramsClasificados?.tipo?.slug;
    const nuevaSeleccion = amoblado === tipoSlugActual ? "" : amoblado;

    setAmoblado(nuevaSeleccion);
    setOpen(false);

    const newFiltros = [...(filtros || [])];

    if (tipoSlugActual) {
      const index = newFiltros.indexOf(tipoSlugActual);
      if (index !== -1) {
        if (nuevaSeleccion) {
          // Si hay nueva selección, reemplazar
          newFiltros[index] = nuevaSeleccion;
        } else {
          // Si se deseleccionó (nuevaSeleccion es ""), eliminar
          newFiltros.splice(index, 1);
        }
      }
    } else {
      if (nuevaSeleccion) {
        newFiltros.push(nuevaSeleccion);
      }
    }

console.log("se fue de cierre")
  setOpen(false)

    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
  }














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

          <FiltroAmoblado onClick={onClick} goal={amoblado} />

          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
