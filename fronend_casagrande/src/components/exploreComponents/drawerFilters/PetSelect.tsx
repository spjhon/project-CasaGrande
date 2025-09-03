"use client"

// Importaciones de componentes primitivos de shadcn
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PetTypeState } from "../FiltersDrawer"
import { FILTERS_CONFIG } from "@/lib/utilsFiltersDrawer"

// Props que recibe el componente
interface PetSelectProps {
  selectedPet: PetTypeState
  setSelectedPet: (pet: PetTypeState) => void
}

/**
 * Retorna checkboxes controlados con el state utilizando shadcn
 * Solo permite seleccionar UNA opción a la vez
 */
export function PetSelect({ selectedPet, setSelectedPet }: PetSelectProps) {
  

  /**
   * Si el usuario marca (checked = true) → guardamos solo ese slug.
   * Si el usuario desmarca (checked = false) → reseteamos a null.
   */
  const togglePet = (slug: PetTypeState, checked: boolean) => {
    setSelectedPet(checked ? slug : null)
  }

  return (
    <div className="flex flex-col gap-4 my-6">
      {FILTERS_CONFIG.petOptions.map((option) => (
        <Label
          key={option.slug}
          className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 cursor-pointer
            has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50
            dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
        >
          <Checkbox
            id={option.slug === null? undefined : option.slug}
            checked={selectedPet === option.slug}
            onCheckedChange={(checked) => togglePet(option.slug, checked === true)}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white
              dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
          <span className="text-sm font-bold">{option.label}</span>
        </Label>
      ))}
    </div>
  )
}
