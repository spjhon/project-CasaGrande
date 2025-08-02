"use client"

//Importaciones de hooks
import { useState } from "react"

//Importacion de fuse
import Fuse from "fuse.js"

//Importaciones del json
import ciudadesColombia from "@/data/ciudades.json"

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
import { cn, slugify } from "@/lib/utils"

//Importacion del router para la navegacion desde i18n
import { useRouter } from "@/i18n/navigation"

//Importacion de los types desde el layout donde esta la funcion
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout"

/*estraccion de los datos del json
Explicacion de este flatmap al final de este archivo
La estructura final es algo asi por cada elemento del array final
Object { city: "leticia", label: "Leticia", departamento: "Amazonas" }
Object { city: "puerto nariño", label: "Puerto Nariño", departamento: "Amazonas" }
como se puede observar el departamento esta repetido con el fin de tener un solo object por ciudad con su respectivo deptarta
Formateo de ciudades
*/
const ciudades = ciudadesColombia.flatMap((dep) =>
  dep.ciudades.map((ciudad) => ({
    slug: slugify(ciudad),
    name: ciudad,
    departamento: dep.departamento,
  }))
)

// Inicializamos Fuse
const fuse = new Fuse(ciudades, {
  keys: ["name", "departamento"],
  threshold: 0.3,
})

//Types

type CiudadOption = {
  slug: string
  name: string
  departamento: string
}

type CitySearchProps = {
  filtros?: string[];
  paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
};


export function SearchCity({ 
  filtros = []/*Valor por defecto para un array vacio en caso de ser undefined */,
  paramsClasificados
}: CitySearchProps) {
  
  
  
  const ciudadSlug = paramsClasificados?.ciudad?.slug;
  const newFiltros = [...filtros]; // este const para darle orden a la url con 4 parametros
  const [open, setOpen] = useState(false)
  const [city, setCity] = useState(ciudadSlug === "todas-las-ciudades" ? "" : ciudadSlug ?? "");
  const [inputValue, setInputValue] = useState(city)

  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key city es igual al city guardado en el state
  const selected: CiudadOption | undefined = ciudades.find((ciudades) => ciudades.slug === city)
 

  //Esto devuelve una lista de resultados tipo:
  /*
  [
    { item: { label: "Manizales", departamento: "Caldas", city: "manizales" }, ... },
    { item: { label: "La Dorada", departamento: "Caldas", city: "la dorada" }, ... },
  ...]
  */
  const filtered: CiudadOption[] = inputValue.length >= 2 ? fuse.search(inputValue).map((res) => res.item) : []


  //este handleOpenChange es una manipulacion al set que se pasa al pop over para que cuando se cierre y no se haya
  //escrito nada en el inputValue entonces quite las selecciones
  //Entonces ya no estás pasándole directamente setOpen, sino una función que tú defines:
    const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    if (inputValue.trim() === "" && !isOpen) {
      // Si se cierra sin escribir ni seleccionar, limpiamos todo
      setCity("")
      newFiltros[0] = "todas-las-ciudades"; // actualizas la ciudad
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
            {selected ? `${selected.name}, ${selected.departamento}` : "Selecciona una ciudad..."}
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
                    onSelect={(currentValue) => {
  setCity(currentValue === city ? "" : currentValue);
  setOpen(false);

  const ciudadSlugActual = paramsClasificados?.ciudad?.slug;

  // Copia del array original
  const newFiltros = [...(filtros || [])];

  if (ciudadSlugActual) {
    const indexCiudad = newFiltros.findIndex(f => f === ciudadSlugActual);

    if (indexCiudad !== -1) {
      // Reemplazar el slug de ciudad
      newFiltros[indexCiudad] = currentValue;
    } else {
      // Si no se encuentra, agregarlo al final
      newFiltros.push(currentValue);
    }
  } else {
    // No había ciudad antes → agregarla
    newFiltros.push(currentValue);
  }

  // Navegar con los nuevos filtros
  // @ts-expect-error es necesario
  router.push(`/explore/${newFiltros.join("/")}`);
}}
                  >
                    {ciudad.name}, {ciudad.departamento}
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












/**
 * Explicacion del flatmap
 * 
 * entonces lo que hace el map inicial, el map que hace junto al flat es que cada elemento es un object en el cual 
 * hay un key que tiene un array (la key de ciudades), pero entonces lo que retorna ese map (y que hace esto por cada object 
 * en el array del json), es el valor de lo que pase adentro y como lo que pasa adentro es que se extrae o se acomoda la 
 * informacion, lo que retorna es un array con la forma que se quiere pero eso es un array por cada key y todas esas keys estan 
 * dentro de un array, entonces la idea del falt a un nive es destruir esos arrays que encierran cada elemento que antes era un 
 * object (no lo transforma, es parte de un array nuevo pero pues toma su posicion) y como no hay un elemento jerarquico sino 
 * que se creo esa redundancia en el map interior entonces no es necesario que este en un array por elemento sino que se esparza 
 * asi ocupe mas elementos en el array exterior, estoy bien asi?
 * 
 * 
 * 
 * ¡Sí Juan! Estás **muy, muy cerca** de comprenderlo completamente. Vamos a pulir tu explicación con un desglose detallado para que te quede **cristalino**.

---

## 🔍 1. ¿Qué recibe `flatMap`?

Recibe una **función que devuelve un array**.

Tú escribiste:

```ts
ciudadesColombia.flatMap((dep) =>
  dep.ciudades.map((ciudad) => ({
    city: ciudad.toLowerCase(),
    label: ciudad,
    departamento: dep.departamento,
  }))
)
```

Entonces para cada `dep` (departamento), la función hace esto:

### ➤ `dep = { departamento: "Caldas", ciudades: ["Manizales", "Chinchiná"] }`

Ese `.map(...)` **devuelve un array de objetos**, por ejemplo:

```ts
[
  { city: "manizales", label: "Manizales", departamento: "Caldas" },
  { city: "chinchiná", label: "Chinchiná", departamento: "Caldas" }
]
```

---

## 🔍 2. ¿Qué hace `flatMap`?

Hace lo mismo que si hicieras:

```ts
array.map(...).flat()
```

O sea:

1. Recorre cada elemento (como un `map`)
2. Pero **automáticamente aplana** (quita la capa de arrays intermedios)

---

## 🎯 Entonces tú dijiste:

> *"lo que retorna ese map... es un array por cada key..."*

🔸 Correcto. Por cada departamento (`dep`), el `.map(...)` devuelve un **array de ciudades convertidas a objetos**.

> *"...y todas esas keys están dentro de un array"*

🔸 Casi. Realmente no son keys. Son arrays (uno por cada departamento), entonces el resultado intermedio sin `flatMap` sería algo así como:

```ts
[
  [ // de Caldas
    { ...Manizales },
    { ...Chinchiná }
  ],
  [ // de Antioquia
    { ...Medellín },
    { ...Bello }
  ],
  ...
]
```

> *"...entonces la idea del flat es destruir esos arrays..."*

🔸 ¡Exactamente! El `.flatMap(...)` aplana eso a un solo array plano:

```ts
[
  { ...Manizales },
  { ...Chinchiná },
  { ...Medellín },
  { ...Bello }
]
```

> *"...no lo transforma, es parte de un array nuevo pero toma su posición..."*

🔸 👌 Perfecto. Los objetos **no se modifican más**, simplemente **se sacan de los arrays intermedios y se colocan juntos en el mismo nivel**.

---

## ✅ En resumen

Tu comprensión es **muy buena**. Solo que en lugar de hablar de “keys”, lo correcto sería decir:

> “El `map` interno devuelve arrays de objetos por cada departamento, y `flatMap` los aplana todos en un solo array continuo.”

---

Si lo representaras visualmente:

### Antes de `flatMap`:

```ts
[
  [obj1, obj2],   // ciudades de Caldas
  [obj3, obj4],   // ciudades de Antioquia
]
```

### Después de `flatMap`:

```ts
[obj1, obj2, obj3, obj4]  // todas las ciudades, una tras otra
```

---

¿Quieres que te muestre el mismo ejemplo en código paso a paso? ¿O hacemos una versión sin `flatMap` para comparar?

 */

