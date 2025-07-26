"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import ciudadesColombia from "@/data/ciudades.json"

type CiudadOption = {
  value: string
  label: string
  departamento: string
}

const ciudades: CiudadOption[] = ciudadesColombia.flatMap((dep) =>
  dep.ciudades.map((ciudad: string) => ({
    value: ciudad.toLowerCase(),
    label: ciudad,
    departamento: dep.departamento,
  }))
)

export function CitySearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [inputValue, setInputValue] = React.useState("")

  const selected = ciudades.find((c) => c.value === value)

  const filteredCities =
    inputValue.length >= 2
      ? ciudades.filter((ciudad) =>
          ciudad.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      : []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {selected
            ? `${selected.label}, ${selected.departamento}`
            : "Selecciona una ciudad..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar ciudad..."
            className="h-9"
            onValueChange={setInputValue}
            value={inputValue}
          />
          <CommandList>
            {inputValue.length < 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Escribe al menos 2 letras para buscar.
              </div>
            ) : filteredCities.length === 0 ? (
              <CommandEmpty>No se encontraron ciudades.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredCities.map((ciudad) => (
                  <CommandItem
                    key={`${ciudad.value}-${ciudad.departamento}`}
                    value={ciudad.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                      setInputValue("") // limpiar el input después de seleccionar
                    }}
                  >
                    {ciudad.label}, {ciudad.departamento}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === ciudad.value
                          ? "opacity-100"
                          : "opacity-0"
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
