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
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout"



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
  paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
};

export function SearchNeightbor({ filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados
 }: NeightborSearchProps) {

  const Neightborslug = paramsClasificados?.barrio?.slug;
  const newFiltros = [...filtros]; // este const para darle orden a la url con 4 parametros


  const [open, setOpen] = useState(false)
  const [neightbor, setBarrio] = useState(Neightborslug === "todos-los-barrios" ? "" : Neightborslug ?? "");
  const [inputValue, setInputValue] = useState(neightbor)

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key city es igual al city guardado en el state
  /*Cada barrio a buscar viene asi:
  {"id": "9", "nombre": "San Rafael", "slug": "san-rafael", "ciudad": "Manizales", "departamento": "Caldas"}*/
  const selected: barriosdeColombia | undefined = barriosColombiaJson.find((barrioABuscar) => barrioABuscar.slug === neightbor)
 

  //Esto devuelve una lista de resultados tipo:
  /*
  {
    "id": "1",
    "nombre": "Palogrande",
    "slug": "palogrande",
    "ciudad": "Manizales",
    "departamento": "Caldas"
  },
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
      newFiltros[1] = "todos-las-barrios"; // actualizas la ciudad
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
            {selected ? `${selected.nombre}, ${selected.ciudad}` : "Selecciona un barrio..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar barrio..."
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
              <CommandEmpty>No se encontraron barrios.</CommandEmpty>) : (
              <CommandGroup>
                {filtered.map((barrio) => (
                  <CommandItem
                    key={`${barrio.slug}-${barrio.ciudad}`}
                    value={barrio.slug}
                    onSelect={(currentValue) => {
  const selectedBarrioSlug = paramsClasificados?.barrio?.slug;
  const nuevaSeleccion = currentValue === selectedBarrioSlug ? "" : currentValue;

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
}}
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
            )}
          </CommandList>
        </Command>
      </PopoverContent>


    </Popover>
  )
}
