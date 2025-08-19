import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type generoLabels =  "todos" | "solo-hombres" | "solo-mujeres" | "mixto";


type Direction = "prev" | "next";

type FiltroProps = {
  onClick: (direction: Direction) => void; // función que recibe la dirección
  goal: generoLabels
  label: string; // etiqueta para mostrar (ej: "Amoblado")
};




export function FourStateComponent({ onClick, goal, label}: FiltroProps) {



  let getGeneroLabel: string;

  switch (goal) {
    case "todos":
      getGeneroLabel = "Todos";
      break;
    case "solo-hombres":
      getGeneroLabel = "Solo Hombres";
      break;
    case "solo-mujeres":
      getGeneroLabel = "Solo Mujeres";
      break;
    case "mixto":
      getGeneroLabel = "Mixto";
      break;
    default:
      getGeneroLabel = "Desconocido";
  }


  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("prev")}
          disabled={goal === "todos"}
        >
          <Minus />
          <span className="sr-only">Anterior</span>
        </Button>

        <div className="flex-1 text-center">
          <div className="text-4xl font-bold tracking-tighter">{getGeneroLabel}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase">
            {label}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("next")}
          disabled={goal === "mixto"}
        >
          <Plus />
          <span className="sr-only">Siguiente</span>
        </Button>
      </div>

      
    </div>
  );
}
