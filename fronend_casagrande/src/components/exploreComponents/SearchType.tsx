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
import { Check, ChevronsUpDown } from "lucide-react"

//Importacion de utilidades
import { cn } from "@/lib/utils"

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"

//Importacion de los types de los parametros ya clasificados desde el layout donde esta la funcion
import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout"

//Types


type tipodeArriendoOption = {
  id: string
  label: string
  slug: string
}


type TipodeArriendoSearchProps = {
    urlFilters?: string[];
    paramsClasificados?: finalResultFromClasificarParams;
    tipodeArriendo?: tipodeArriendoOption[];
};

/**
 * 
 * @param filtros Es un array de filtros que son de la url desde layout
 * @param paramsClasificados Es un array de filtros que son de la url desde layout que ya estan filtrados y hay 
 * seguridad de a donde pertenece cada param y el object con la informacion
 * @tipodeArriendo Todo el object de tipo de arriendo ya slugidificado y listo para incorporarse al selected
 * 
 * @returns Un dropdown con los tipos de arriendos listas para buscar y el tipo de arriendo seleccionado en caso de haberlo
 */
export function SearchType({ 
  urlFilters = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  tipodeArriendo = []
}: TipodeArriendoSearchProps) {
  
  
  //obtiene el slug de los params que ya fueron clasificados en caso de existir
  const ciudadSlug = paramsClasificados?.tipo?.slug;
  
  //Este es el state para abrir y cerrar el dropdown
  const [open, setOpen] = useState(false)
  //Este state es para establecer que ciudad va en el selected, si viene del slug del layout entonces va ese, sino va vacio
  const [tipo, setTipo] = useState(ciudadSlug ?? "");
  

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key slug es igual al slug guardado en el state
  const selected: tipodeArriendoOption | undefined = tipodeArriendo.find((tipodeArriendoaBuscar) => tipodeArriendoaBuscar.slug === tipo)

  //Este el el inputValue que hace que el componente sea controlado y saber por cada tecla que input ha ingresado el usuario
  const [inputValue, setInputValue] = useState(selected? selected.label : "");
  
 

  //este handleOpenChange es una manipulacion al set que se pasa al pop over para que cuando se cierre y no se haya
  //escrito nada en el inputValue entonces quite las selecciones
  //Entonces ya no estás pasándole directamente setOpen, sino una función que tú defines:
  const handleOpenChange = (isOpen: boolean) => {

    setOpen(isOpen)

    if (inputValue === "" && !isOpen) {
      // Si se cierra sin escribir ni seleccionar, limpiamos todo
      setTipo("")
      handleOnSelect("")
    }
  }

  const handleOnSelect = (currentValue: string) => {
    const tipoSlugActual = paramsClasificados?.tipo?.slug;
    const nuevaSeleccion = currentValue === tipoSlugActual ? "" : currentValue;

    setTipo(nuevaSeleccion);
    setOpen(false);

    const newFiltros = [...(urlFilters || [])];

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
          className="w-[32.5rem] justify-between h-auto"
          >
            {selected ? `${selected.label}` : "Selecciona un tipo..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[32.5rem] p-0" >
        <Command>
          <CommandInput
            placeholder="Buscar tipo..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            
              <CommandEmpty>No se encontraron tipos.</CommandEmpty>
              <CommandGroup>
                {tipodeArriendo.map((tipoOperacion) => (
                  <CommandItem
                    key={`${tipoOperacion.slug}`}
                    value={tipoOperacion.label}
                    onSelect={() => handleOnSelect(tipoOperacion.slug)}
                  >
                    {tipoOperacion.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        tipo === tipoOperacion.slug ? "opacity-100" : "opacity-0"
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
