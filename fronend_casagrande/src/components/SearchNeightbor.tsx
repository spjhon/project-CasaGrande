"use client"

//Importaciones de hooks
import { useState } from "react"

//Importacion de fuse
import Fuse from "fuse.js"

//Importaciones del json
import barriosColombiaJson from "@/data/barrios.json"

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
import { Check, ChevronsUpDown } from "lucide-react"

//Importacion de utilidades
import { cn } from "@/lib/utils"

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"



// Inicializamos Fuse
const fuse = new Fuse(barriosColombiaJson, {
  keys: ["nombre"],
  threshold: 0.3,
})

//Types

type barriosdeColombia = {
  id: string
  nombre: string
  slug: string
  ciudad: string
  departamento: string

}

type NeightborSearchProps = {
  filtros?: string[];
};

export function SearchCity({ filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */ }: NeightborSearchProps) {
  const newFiltros = [...filtros]; // este const para darle orden a la url con 4 parametros
  const [open, setOpen] = useState(false)
  const [barrio, setBarrio] = useState(filtros[1]?(filtros[1]==="todos-los-barrios"?"":filtros[1]):"")
  const [inputValue, setInputValue] = useState(barrio)

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key city es igual al city guardado en el state
  /*Cada barrio a buscar viene asi:
  {"id": "9", "nombre": "San Rafael", "slug": "san-rafael", "ciudad": "Manizales", "departamento": "Caldas"}*/
  const selected: barriosdeColombia | undefined = barriosColombiaJson.find((barrioABuscar) => barrioABuscar.nombre === barrio)
 

  //Esto devuelve una lista de resultados tipo:
  /*
  [
    { item: { label: "Manizales", departamento: "Caldas", city: "manizales" }, ... },
    { item: { label: "La Dorada", departamento: "Caldas", city: "la dorada" }, ... },
  ...]
  */
  const filtered: barriosdeColombia[] = inputValue.length >= 2 ? fuse.search(inputValue).map((res) => res.item) : []


  //este handleOpenChange es una manipulacion al set que se pasa al pop over para que cuando se cierre y no se haya
  //escrito nada en el inputValue entonces quite las selecciones
  //Entonces ya no estás pasándole directamente setOpen, sino una función que tú defines:
    const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    if (inputValue.trim() === "" && !isOpen) {
      // Si se cierra sin escribir ni seleccionar, limpiamos todo
      setBarrio("")
      newFiltros[1] = "todas-las-barrios"; // actualizas la ciudad
      // @ts-expect-error es necesario
      router.push(`/explore/${newFiltros.join("/")}`);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>

      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
          >
            {selected ? `${selected.barrio}, ${selected.ciudad}` : "Selecciona una ciudad..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar ciudad..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            {inputValue.length < 2 ? (
              
              <div className="p-4 text-center text-sm text-muted-foreground">
                Escribe al menos 2 letras para buscar.
              </div>
            
            ) : filtered.length === 0 ? (
              <CommandEmpty>No se encontraron ciudades.</CommandEmpty>) : (
              <CommandGroup>
                {filtered.map((barrio) => (
                  <CommandItem
                    key={`${barrio.barrio}-${barrio.ciudad}`}
                    value={barrio.barrio}
                    onSelect={(currentValue) => {
                      setBarrio(currentValue === barrio ? "" : currentValue)
                      setOpen(false)
                      newFiltros[1] = currentValue; // actualizas la ciudad
                      // @ts-expect-error es necesario
                      router.push(`/explore/${newFiltros.join("/")}`);
                    }}
                  >
                    {barrio.barrio}, {barrio.ciudad}
                    <Check
                      className={cn(
                        "ml-auto",
                        barrio === barrio.barrio ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>


    </Popover>
  )
}
