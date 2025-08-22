"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function PetSelect() {
  const [selectedPets, setSelectedPets] = useState<string[]>([])

  const options = [
    { slug: "gatos", label: "GATOS" },
    { slug: "perros-pequenos", label: "PERROS PEQUEÑOS" },
    { slug: "perros-grandes", label: "PERROS GRANDES" },
  ]

  /**
   * Si el usuario marca (checked = true) → añadimos el id al array.
   * Si el usuario desmarca (checked = false) → quitamos ese id del array.
   * setSelectedPets se encarga de actualizar el estado.
   * @param slug 
   * @param checked 
   */
  const togglePet = (slug: string, checked: boolean) => {
    setSelectedPets((prevState) =>
      checked ? [...prevState, slug] : prevState.filter((pet) => pet !== slug)
    )
  }

  return (
    <div className="flex flex-col gap-4 my-6">
      {options.map((option) => (
        <Label
          key={option.slug}
          className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 cursor-pointer
            has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50
            dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
        >
          <Checkbox
            id={option.slug}
            checked={selectedPets.includes(option.slug)}
            onCheckedChange={(checked) => togglePet(option.slug, checked === true)}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white
              dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
          <span className="text-sm font-medium">{option.label}</span>
        </Label>
      ))}
    </div>
  )
}
