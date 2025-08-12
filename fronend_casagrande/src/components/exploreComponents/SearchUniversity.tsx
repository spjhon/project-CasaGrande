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
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout"


//Types

type UniversidadesdeColombiaJson = {
  id: string,
  label: string,
  slug: string,
  tipo: string,
  ciudad: string,
  ciudadSlug: string,
  departamento: string,
  universidad: string

}

type UniversidadSearchProps = {
  filtros?: string[];
  paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
  universidadesdeColombiaJson?: UniversidadesdeColombiaJson[]
};

let universidadesdeColombiaJsonARenderizar = []

export function SearchUniversity({ filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados,
  universidadesdeColombiaJson = []
 }: UniversidadSearchProps) {

  const UniversidadSlug = paramsClasificados?.universidad?.slug;
  const ciudadSlug = paramsClasificados?.ciudad?.slug;


//Este if lo que hace es que si existe una ciudad entonces filtre los barrios 
if (ciudadSlug) {
  universidadesdeColombiaJsonARenderizar = universidadesdeColombiaJson.filter((universidad) => universidad.ciudadSlug === ciudadSlug)
}else{
  universidadesdeColombiaJsonARenderizar = [...universidadesdeColombiaJson]
}

  const [open, setOpen] = useState(false)
  const [university, setUniversity] = useState(UniversidadSlug ?? "");
  

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key neightborslug es igual al neighbor guardado en el state
  /*Cada barrio a buscar viene asi:
  {"id": "9", "nombre": "San Rafael", "slug": "san-rafael", "ciudad": "Manizales", "departamento": "Caldas"}*/
  const selected: UniversidadesdeColombiaJson | undefined = universidadesdeColombiaJson.find((universidadABuscar) => universidadABuscar.slug === university)
  
  //El codigo nfd de normalizacion es para eliminar las tildes y que el buscador lo entienda.
 const [inputValue, setInputValue] = useState(selected? selected.label : "");

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
      setUniversity("")
      handleOnSelect("")
  }
  }

  const handleOnSelect = (currentValue: string) => {
    const selectedUniversidadSlug = paramsClasificados?.universidad?.slug;
    const nuevaSeleccion = currentValue === selectedUniversidadSlug ? "" : currentValue;
    const newFiltros = [...filtros]; 
    setUniversity(nuevaSeleccion);
    setOpen(false);

    // Clonar el array original
    const updatedFiltros = [...newFiltros];

    if (selectedUniversidadSlug) {
      // Si ya había un barrio, reemplazarlo en su posición
      const index = updatedFiltros.indexOf(selectedUniversidadSlug);
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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[500px] justify-between"
          >
            {selected ? `${selected.label}, ${selected.ciudad}` : "Selecciona una Universidad..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[500px] p-0" >
        <Command>
          <CommandInput
            placeholder="Buscar Universidad..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            
              <CommandEmpty>{`No se encontraron Universidades, ${paramsClasificados?.ciudad?.label?? ""}`}</CommandEmpty>
              <CommandGroup>
                {universidadesdeColombiaJsonARenderizar.map((universidad) => (
                  <CommandItem
                    key={`${universidad.slug}-${universidad.ciudad}`}
                    value={universidad.label}
                    onSelect={() => handleOnSelect(universidad.slug)}
                  >
                    {universidad.label}, {universidad.ciudad}
                    <Check
                      className={cn(
                        "ml-auto",
                        university === universidad.slug ? "opacity-100" : "opacity-0"
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
