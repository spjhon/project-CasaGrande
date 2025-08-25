import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react"

export function MinTimeSelect({ }) {

    const [contract, setContract] = useState("")
  return (
    <div className="flex flex-col gap-2 my-6">
      <span className="text-sm text-muted-foreground">Contrato mínimo</span>
      <ToggleGroup
        type="single"
        value={contract}
        onValueChange={(val) => setContract(val || "1")}
        className="justify-center"
      >
        <ToggleGroupItem value="1" className="px-4">1 mes</ToggleGroupItem>
        <ToggleGroupItem value="3" className="px-4">3 meses</ToggleGroupItem>
        <ToggleGroupItem value="6" className="px-4">6 meses</ToggleGroupItem>
        <ToggleGroupItem value="12" className="px-4">1 año</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}