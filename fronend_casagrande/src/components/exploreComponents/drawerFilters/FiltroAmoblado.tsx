/**
 * 1️⃣ Cómo Next decide si algo es server o client

    Si un componente NO tiene "use client" y NO es importado por ningún componente cliente → se ejecuta en el servidor como Server Component.

    Si un componente NO tiene "use client", pero sí es importado por un componente cliente (o está en su árbol descendente) → automáticamente pasa a ser client también.
    (Esto es lo que te pasa con FiltroAmoblado ahora mismo).
 */


    //OSEA QUE ESTO ES UN CLIENT COMPONENT
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

type FiltroAmobladoProps = {
  onClick: (delta: number) => void
  goal: number
 
}

export function FiltroAmoblado({ onClick, goal }: FiltroAmobladoProps) {
   
  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(-10)}
          disabled={goal <= 200}
        >
          <Minus />
          <span className="sr-only">Decrease</span>
        </Button>

        <div className="flex-1 text-center">
          <div className="text-7xl font-bold tracking-tighter">{goal}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase">
            Calories/day
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick(10)}
          disabled={goal >= 400}
        >
          <Plus />
          <span className="sr-only">Increase</span>
        </Button>
      </div>

      <div className="mt-3 h-[120px]"></div>
    </div>
  )
}
