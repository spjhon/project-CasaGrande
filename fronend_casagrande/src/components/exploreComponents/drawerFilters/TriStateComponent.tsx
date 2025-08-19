import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type FiltrosState = "Todos" | "Si" | "No";


type Direction = "prev" | "next";

type FiltroProps = {
  onClick: (direction: Direction) => void; // función que recibe la dirección
  goal: FiltrosState; // estado actual (Todos, Si, No)
  label: string; // etiqueta para mostrar (ej: "Amoblado")
};




export function TriStateComponent({ onClick, goal, label }: FiltroProps) {
  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("prev")}
          disabled={goal === "Todos"}
        >
          <Minus />
          <span className="sr-only">Anterior</span>
        </Button>

        <div className="flex-1 text-center">
          <div className="text-4xl font-bold tracking-tighter">{goal}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase">
            {label}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("next")}
          disabled={goal === "No"}
        >
          <Plus />
          <span className="sr-only">Siguiente</span>
        </Button>
      </div>

      
    </div>
  );
}
