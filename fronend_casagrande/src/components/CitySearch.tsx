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
import { cn } from "@/lib/utils"
import { useRouter } from "@/i18n/navigation"

//estraccion de los datos del json
//Explicacion de este flatmap al final de este archivo
//La estructura final es algo asi por cada elemento del array final
//Object { value: "leticia", label: "Leticia", departamento: "Amazonas" }
//Object { value: "puerto nariño", label: "Puerto Nariño", departamento: "Amazonas" }
//como se puede observar el departamento esta repetido con el fin de tener un solo object por ciudad con su respectivo deptarta
//1. Formateo de ciudades
const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD") // Descompone tildes
    .replace(/[\u0300-\u036f]/g, "") // Remueve los acentos
    .replace(/ñ/g, "n") // Reemplaza ñ
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y caracteres especiales por guiones
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio/final

const ciudades = ciudadesColombia.flatMap((dep) =>
  dep.ciudades.map((ciudad) => ({
    value: slugify(ciudad),
    label: ciudad,
    departamento: dep.departamento,
  }))
)

// 2. Inicializamos Fuse
const fuse = new Fuse(ciudades, {
  keys: ["label", "departamento"],
  threshold: 0.3,
})

//Types

type CiudadOption = {
  value: string
  label: string
  departamento: string
}

type CitySearchProps = {
  value: string;
  setValue: (value: string) => void;
};

export function CitySearch({ value, setValue }: CitySearchProps) {
  const [open, setOpen] = useState(false)
  
  const [inputValue, setInputValue] = useState(value)
  const router = useRouter();

  //Este filto lo que hace es guardar en selected todo el object cuyo key value es igual al value guardado en el state
  const selected: CiudadOption | undefined = ciudades.find((ciudades) => ciudades.value === value)
 

  //Esto devuelve una lista de resultados tipo:
  /*
  [
    { item: { label: "Manizales", departamento: "Caldas", value: "manizales" }, ... },
    { item: { label: "La Dorada", departamento: "Caldas", value: "la dorada" }, ... },
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
      setValue("")
      // @ts-expect-error es necesario
        router.push(`/explore/type/ciudades`)
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
                    key={`${ciudad.value}-${ciudad.departamento}`}
                    value={ciudad.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                      // @ts-expect-error es necesario
                      router.push(`/explore/type/${currentValue}`)
                    }}
                  >
                    {ciudad.label}, {ciudad.departamento}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === ciudad.value ? "opacity-100" : "opacity-0"
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
    value: ciudad.toLowerCase(),
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
  { value: "manizales", label: "Manizales", departamento: "Caldas" },
  { value: "chinchiná", label: "Chinchiná", departamento: "Caldas" }
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

