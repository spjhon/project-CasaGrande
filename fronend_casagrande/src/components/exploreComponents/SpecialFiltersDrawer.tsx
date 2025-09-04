"use client"

import * as React from "react"
import { CircleEllipsis, Minus, Plus } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout"



type FiltersDrawerProps = {
  urlFilters?: string[];
  paramsClasificados?: finalResultFromClasificarParams;
};

export function SpecialFiltersDrawer({paramsClasificados}: FiltersDrawerProps) {
  

    //Cantidad de filtros del drawer para poder contar cuandos hay seleccionados en el drawer
    const QuantityOfSpecialDrawerFiltersFromParamsClasificados = paramsClasificados?.caracteristicasEspeciales ? paramsClasificados.caracteristicasEspeciales.length : 0

  return (
    <Drawer>


      <DrawerTrigger asChild>
        <Button className="font-bold" variant="outline">
            <CircleEllipsis></CircleEllipsis>
            Caracteristicas Especiales | {`${QuantityOfSpecialDrawerFiltersFromParamsClasificados}`} Seleccionados
        </Button>
      </DrawerTrigger>


      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
               
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                
                <div className="text-muted-foreground text-[0.70rem] uppercase">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
             
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>

          </div>


          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>


        </div>
      </DrawerContent>
    </Drawer>
  )
}
