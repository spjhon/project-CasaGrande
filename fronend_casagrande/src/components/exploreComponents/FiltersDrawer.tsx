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

//Tipos utilizados en el state del primer filtro ya que sino typescript inferiria que el state inicial es solo un string y no un array
type AmobladoState = "Cualquiera" | "Si" | "No";

//Constante utilizada para saber los diferentes states y hacer las respectivas comparaciones
const estados: AmobladoState[] = ["Cualquiera", "Si", "No"];


/**
 * 
 * @returns Retorna el drawer con todos sus hijos que son filtros y con el boton de submit que le da un .push() a la url
 */
export function FiltersDrawer() {

  //El state para saber si el usuario escoje ambos, amoblado o sin amoblar
  const [amoblado, setAmoblado] = useState<AmobladoState>("Cualquiera");

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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">+ Filtros</Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>Personaliza tu búsqueda.</DrawerDescription>
          </DrawerHeader>

          <FiltroAmoblado onClick={onClick} goal={amoblado} />

          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
