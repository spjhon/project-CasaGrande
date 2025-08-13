import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type AmobladoState = "Cualquiera" | "Si" | "No";

type FiltroAmobladoProps = {
  onClick: (direction: "prev" | "next") => void;
  goal: AmobladoState;
};

export function FiltroAmoblado({ onClick, goal }: FiltroAmobladoProps) {
  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("prev")}
          disabled={goal === "Cualquiera"}
        >
          <Minus />
          <span className="sr-only">Anterior</span>
        </Button>

        <div className="flex-1 text-center">
          <div className="text-4xl font-bold tracking-tighter">{goal}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase">
            Estado amoblado
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

      <div className="mt-3 h-[120px]"></div>
    </div>
  );
}
