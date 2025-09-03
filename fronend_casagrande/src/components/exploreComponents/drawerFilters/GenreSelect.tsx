import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Direction, GeneroTypeState } from "../FiltersDrawer";
import { FILTERS_CONFIG } from "@/lib/utilsFiltersDrawer";

type FiltroProps = {
  onClick: (direction: Direction) => void;
  goal: GeneroTypeState;
  label: string;
};

export function GenreSelect({ onClick, goal, label }: FiltroProps) {
  const generoOptions = FILTERS_CONFIG.generoOptions;

  // Busca la opción actual en el config
  const currentIndex = generoOptions.findIndex((opt) => opt.slug === goal);
  const currentLabel = generoOptions[currentIndex]?.label ?? "Desconocido";

  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("prev")}
          disabled={currentIndex <= 0} // Deshabilita si ya está en la primera opción
        >
          <Minus />
          <span className="sr-only">Anterior</span>
        </Button>

        <div className="flex-1 text-center">
          <div className="text-4xl font-bold tracking-tighter">{currentLabel}</div>
          <div className="text-muted-foreground text-[0.70rem] uppercase font-bold">
            {label}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => onClick("next")}
          disabled={currentIndex >= generoOptions.length - 1} // Deshabilita si está en la última
        >
          <Plus />
          <span className="sr-only">Siguiente</span>
        </Button>
      </div>
    </div>
  );
}
