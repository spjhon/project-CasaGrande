import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ContractTypeState, FILTERS_CONFIG } from "../FiltersDrawer"




// Props que recibe el componente
interface MinTimeSelectProps {
  contract: ContractTypeState
  setContract: (valor: ContractTypeState) => void
}


export function MinTimeSelect({contract, setContract}: MinTimeSelectProps) {
  



  return (
    <div className="flex flex-col gap-2 my-6">

      <span className="text-sm text-muted-foreground">Contrato mínimo</span>

      <ToggleGroup
        type="single"
        value={contract ?? ""} // ToggleGroup necesita un string
        onValueChange={(val) => {
          if (val === contract) {
            setContract(null) // limpiamos con null
          } else {
            setContract(val as ContractTypeState)
          }
        }}
        className="justify-center"
      >
        {FILTERS_CONFIG.contractOptions.map((option) => (
          <ToggleGroupItem
            key={option.slug}
            value={option.slug}
            className="px-4"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
