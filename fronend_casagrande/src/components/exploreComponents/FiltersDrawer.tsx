"use client"

import { useState } from "react"

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
import { FiltroAmoblado } from "./drawerFilters/FiltroAmoblado"

export function FiltersDrawer() {
    const [goal, setGoal] = useState(350);

function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
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
                <DrawerDescription>Personaliza tu busqueda.</DrawerDescription>
            </DrawerHeader>

            <FiltroAmoblado onClick={onClick} goal={goal}></FiltroAmoblado>

            <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
                </DrawerClose>
            </DrawerFooter>

        </div>
      </DrawerContent>

    </Drawer>
  )
}
