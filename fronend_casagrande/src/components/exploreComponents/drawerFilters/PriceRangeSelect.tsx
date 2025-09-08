
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


type PriceRangeSelectProps = {
  minPrice: number | null
  setMinPrice: (value: number | null) => void
  maxPrice: number | null
  setMaxPrice: (value: number | null) => void
}

export function PriceRangeSelect({minPrice, setMinPrice, maxPrice, setMaxPrice}:PriceRangeSelectProps) {
  

  const formatCurrency = (value: number | null) => {
    if (value === null) return ""
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const parseNumber = (value: string) => {
    const numeric = value.replace(/\D/g, "")
    return numeric ? Number(numeric) : null
  }

  return (
    <div className="flex flex-col gap-4 my-6">
      <span className="text-sm text-muted-foreground">Rango de precios</span>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="min-price">Precio mínimo</Label>
          <Input
            id="min-price"
            className="border-border"
            type="text"
            inputMode="numeric"
            placeholder="$0"
            value={formatCurrency(minPrice)}
            onChange={(e) => setMinPrice(parseNumber(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="max-price">Precio máximo</Label>
          <Input
            id="max-price"
            className="border-border"
            type="text"
            inputMode="numeric"
            placeholder="$0"
            value={formatCurrency(maxPrice)}
            onChange={(e) => setMaxPrice(parseNumber(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
