"use client"

import * as React from "react"
import { CircleEllipsis } from "lucide-react"
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
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { useState } from "react"
import { useRouter } from "@/i18n/navigation"

type FiltersDrawerProps = {
  urlFilters?: string[];
  paramsClasificados?: finalResultFromClasificarParams;
  specialFiltersJson: {
    label: string,
    slug: string,
    category: string
  }[];
};

export function SpecialFiltersDrawer({ paramsClasificados, urlFilters, specialFiltersJson }: FiltersDrawerProps) {

  const router = useRouter();
  

  //paramsClasificados?.caracteristicasEspeciales.map((item) => paramsClasificados?.caracteristicasEspeciales[item].slug );
  const selectedFiltersInitialState = paramsClasificados?.caracteristicasEspeciales?.map((item) => (item.slug))
  console.log(selectedFiltersInitialState)

  // State local para manejar filtros seleccionados
  const [selectedFilters, setSelectedFilters] = useState<string[]>(selectedFiltersInitialState ?? [])
  //Este es el state para abrir y cerrar el dropdown
    const [open, setOpen] = useState(false)

  const QuantityOfSpecialDrawerFiltersFromParamsClasificados =
    paramsClasificados?.caracteristicasEspeciales ? paramsClasificados.caracteristicasEspeciales.length : 0

  const toggleFilter = (slug: string, checked: boolean) => {
    setSelectedFilters((prev) =>
      checked ? [...prev, slug] : prev.filter((f) => f !== slug)
    )
  }






  const handleSubmit = (selectedFilters:string[], urlFilters:string[] | undefined, arrayObjectsParamsCalsificados: string[] ) => {
    console.log("handeliando")
    let newFiltros = [...(urlFilters || [])];

    
    //if () {}



    setOpen(false);
    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
  }







  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="font-bold" variant="outline">
          <CircleEllipsis />
          Características Especiales | {QuantityOfSpecialDrawerFiltersFromParamsClasificados} Seleccionados
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Características Especiales</DrawerTitle>
          <DrawerDescription>Detalles extra para necesidades específicas.</DrawerDescription>
        </DrawerHeader>

        <div className="max-w-300 mx-auto overflow-y-auto flex flex-col gap-4 p-4">
          {specialFiltersJson.map((filter) => (
            <Label
              key={filter.slug}
              className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 cursor-pointer
                has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50
                dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
            >
              <Checkbox
                id={filter.slug}
                checked={selectedFilters.includes(filter.slug)}
                onCheckedChange={(checked) => toggleFilter(filter.slug, checked === true)}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white
                  dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <span className="text-sm font-bold">{filter.label}</span>
            </Label>
          ))}
        </div>

        <DrawerFooter className="mx-auto w-full justify-center my-auto flex-wrap">
          <Button onClick={() => handleSubmit(selectedFilters, urlFilters, paramsClasificados?.caracteristicasEspeciales)}>
            Aplicar filtros
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
