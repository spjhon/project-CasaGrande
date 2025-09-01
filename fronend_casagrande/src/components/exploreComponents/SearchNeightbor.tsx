"use client"

//Importaciones de hooks
import { useState } from "react"

//Importacion de shadcn
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  //CommandSeparator,
  CommandGroup,
} from "@/components/ui/command"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"

//Importacion de utilidades
import { cn } from "@/lib/utils"

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"
import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout"


//Types

type barriosdeColombiaJson = {
  id: string,
  nombre: string,
  slug: string,
  ciudad: string,
  ciudadSlug: string,
  departamento: string

}

type NeightborSearchProps = {
  urlFilters?: string[];
  paramsClasificados?: finalResultFromClasificarParams;
  barriosdeColombiaJson?: barriosdeColombiaJson[]
};

let barriosdeColombiaJsonARenderizar = []

function limitCharactersVisibleLenght (barrioLabel: string, ciudadLabel: string) {
  
  const fullLabel = barrioLabel + ", " + ciudadLabel

  if (fullLabel.length > 35) {
    const cuttedLabel = fullLabel.slice(0, 35).trim() + "..."
    return cuttedLabel
  }

return fullLabel
  
}

export function SearchNeightbor({ urlFilters = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  barriosdeColombiaJson = []
 }: NeightborSearchProps) {

  const Neightborslug = paramsClasificados?.barrio?.slug;
  const ciudadSlug = paramsClasificados?.ciudad?.slug;


//Este if lo que hace es que si existe una ciudad entonces filtre los barrios 
if (ciudadSlug) {
  barriosdeColombiaJsonARenderizar = barriosdeColombiaJson.filter((barrio) => barrio.ciudadSlug === ciudadSlug)
}else{
  barriosdeColombiaJsonARenderizar = [...barriosdeColombiaJson]
}

  const [open, setOpen] = useState(false)
  const [neightbor, setBarrio] = useState(Neightborslug ?? "");
  

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key neightborslug es igual al neighbor guardado en el state
  /*Cada barrio a buscar viene asi:
  {"id": "9", "nombre": "San Rafael", "slug": "san-rafael", "ciudad": "Manizales", "departamento": "Caldas"}*/
  const selected: barriosdeColombiaJson | undefined = barriosdeColombiaJson.find((barrioABuscar) => barrioABuscar.slug === neightbor)
  
  //El codigo nfd de normalizacion es para eliminar las tildes y que el buscador lo entienda.
 const [inputValue, setInputValue] = useState(selected? selected.nombre : "");

  //Esto devuelve una lista de resultados tipo:
  /*
  obj: {
    "id": "1",
    "nombre": "Palogrande",
    "slug": "palogrande",
    "ciudad": "Manizales",
    "departamento": "Caldas"
  },
  */
  


  //este handleOpenChange es una manipulacion al set que se pasa al pop over para que cuando se cierre y no se haya
  //escrito nada en el inputValue entonces quite las selecciones
  //Entonces ya no estás pasándole directamente setOpen, sino una función que tú defines:
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    if (inputValue.trim() === "" && !isOpen) {
      // Si se cierra sin escribir ni seleccionar, limpiamos todo
      setBarrio("")
      handleOnSelect("")
  }
  }

  const handleOnSelect = (currentValue: string) => {
    const selectedBarrioSlug = paramsClasificados?.barrio?.slug;
    const nuevaSeleccion = currentValue === selectedBarrioSlug ? "" : currentValue;
    const newFiltros = [...urlFilters]; 
    setBarrio(nuevaSeleccion);
    setOpen(false);

    // Clonar el array original
    const updatedFiltros = [...newFiltros];

    if (selectedBarrioSlug) {
      // Si ya había un barrio, reemplazarlo en su posición
      const index = updatedFiltros.indexOf(selectedBarrioSlug);
      if (index !== -1) {
        updatedFiltros[index] = nuevaSeleccion;
      }
    } else {
      // Si no había barrio, agregarlo al final (solo si no está vacío)
      if (nuevaSeleccion) {
        updatedFiltros.push(nuevaSeleccion);
      }
    }

    // @ts-expect-error es necesario
    router.push(`/explore/${updatedFiltros.join("/")}`);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>

      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className="w-[20rem] justify-between font-bold"
          >
            <Building2></Building2>
            {selected ? limitCharactersVisibleLenght(selected.nombre, selected.ciudad) : "Selecciona un barrio..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[20rem]" >
        <Command>
          <CommandInput
            placeholder="Buscar barrio..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            
              <CommandEmpty>{`No se encontraron barrios, ${paramsClasificados?.ciudad?.label?? ""}`}</CommandEmpty>
              <CommandGroup>
                {barriosdeColombiaJsonARenderizar.map((barrio) => (
                  <CommandItem
                    key={`${barrio.slug}-${barrio.ciudad}`}
                    value={barrio.nombre}
                    onSelect={() => handleOnSelect(barrio.slug)}
                  >
                    {barrio.nombre}, {barrio.ciudad}
                    <Check
                      className={cn(
                        "ml-auto",
                        neightbor === barrio.slug ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            
          </CommandList>
        </Command>
      </PopoverContent>


    </Popover>
  )
}
