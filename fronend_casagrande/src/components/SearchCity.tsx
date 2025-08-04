"use client"

//Importaciones de hooks
import { useState } from "react"


//import fuzzysort
import fuzzysort from 'fuzzysort'


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

//Importacion de los types desde el layout donde esta la funcion
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout"

//Types

type CiudadOption = {
  slug: string
  label: string
  departamento: string
}

type CitySearchProps = {
  filtros?: string[];
  paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
  ciudades?: CiudadOption[];
};

/**
 * 
 * @param filtros Es un array de filtros que son de la url desde layout
 * @param paramsClasificados Es un array de filtros que son de la url desde layout que ya estan filtrados y hay 
 * seguridad de a donde pertenece cada param y el object con la informacion
 * @ciudades Todo el object de ciudades ya slugidificado y listo para incorporarse al selected
 * 
 * @returns Un dropdown con las ciduades listas para buscar y la ciudad seleccionada en caso de haberla 
 */
export function SearchCity({ 
  filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  ciudades = []
}: CitySearchProps) {
  
  
  //obtiene el slug de los params que ya fueron clasificados en caso de existir
  const ciudadSlug = paramsClasificados?.ciudad?.slug;
  
  //Este es el state para abrir y cerrar el dropdown
  const [open, setOpen] = useState(false)
  //Este state es para establecer que ciudad va en el selected, si viene del slug del layout entonces va ese, sino va vacio
  const [city, setCity] = useState(ciudadSlug ?? "");
  

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key slug es igual al slug guardado en el state
  const selected: CiudadOption | undefined = ciudades.find((ciudadesaBuscar) => ciudadesaBuscar.slug === city)

  //Este el el inputValue que hace que el componente sea controlado y saber por cada tecla que input ha ingresado el usuario
  const [inputValue, setInputValue] = useState(selected?.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "");
  

  const searchResults = inputValue.length >= 2 ? fuzzysort.go(inputValue, ciudades, { key: "label", threshold: -10000 }) : []
  
  //Esto devuelve una lista de resultados tipo:
  /*
  [
    { item: { label: "Manizales", departamento: "Caldas", city: "manizales" }, ... },
    { item: { label: "La Dorada", departamento: "Caldas", city: "la dorada" }, ... },
  ...]
  */
  const filtered: CiudadOption[] = searchResults.map(result => result.obj)

  //este handleOpenChange es una manipulacion al set que se pasa al pop over para que cuando se cierre y no se haya
  //escrito nada en el inputValue entonces quite las selecciones
  //Entonces ya no estás pasándole directamente setOpen, sino una función que tú defines:
  const handleOpenChange = (isOpen: boolean) => {

    setOpen(isOpen)

    if (inputValue.trim() === "" && !isOpen) {
      // Si se cierra sin escribir ni seleccionar, limpiamos todo
      setCity("")
      
    }
  }

  const handleOnSelect = (currentValue: string) => {
    const ciudadSlugActual = paramsClasificados?.ciudad?.slug;
    const nuevaSeleccion = currentValue === ciudadSlugActual ? "" : currentValue;

    setCity(nuevaSeleccion);
    setOpen(false);

    const newFiltros = [...(filtros || [])];

    if (ciudadSlugActual) {
      const index = newFiltros.indexOf(ciudadSlugActual);
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

    // @ts-expect-error es necesario
    router.push(`/explore/${newFiltros.join("/")}`);
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
            {selected ? `${selected.label}, ${selected.departamento}` : "Selecciona una ciudad..."}
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
                {filtered.map((ciudad) => (
                  <CommandItem
                    key={`${ciudad.slug}-${ciudad.departamento}`}
                    value={ciudad.slug}
                    onSelect={(currentValue) => handleOnSelect(currentValue)}
                  >
                    {ciudad.label}, {ciudad.departamento}
                    <Check
                      className={cn(
                        "ml-auto",
                        city === ciudad.slug ? "opacity-100" : "opacity-0"
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
