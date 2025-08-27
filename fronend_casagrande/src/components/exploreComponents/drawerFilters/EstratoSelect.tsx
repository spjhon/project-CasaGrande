import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { EstratoTypeState, FILTERS_CONFIG } from "../FiltersDrawer"




// Props que recibe el componente
interface EstratoSelectProps {
  estrato: EstratoTypeState
  setEstrato: (valor: EstratoTypeState) => void
}


export function EstratoSelect({estrato, setEstrato}: EstratoSelectProps) {
  



  return (
    <div className="flex flex-col gap-2 my-6">

      <span className="text-sm text-muted-foreground">Estrato</span>

      <ToggleGroup
        type="single"
        value={estrato ?? ""} // ToggleGroup necesita un string
        onValueChange={(val) => {
          if (val === estrato) {
            setEstrato(null) // limpiamos con null
          } else {
            setEstrato(val as EstratoTypeState)
          }
        }}
        className="justify-center flex-wrap"
      >
        {FILTERS_CONFIG.estratoOptions.map((option) => (
          <ToggleGroupItem
            key={option.slug}
            value={option.slug}
            className="px-4 min-w-30"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
