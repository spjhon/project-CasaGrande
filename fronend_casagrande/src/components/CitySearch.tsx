// app/components/BuscadorCiudad.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import ciudadesColombia from "@/data/ciudades.json";

type Props = {
  onChange?: (ciudad: string) => void;
};

export default function BuscadorCiudad({ onChange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [input, setInput] = useState("");
  const [sugerencias, setSugerencias] = useState<string[]>([]);

  const allCities = useMemo(
    () => ciudadesColombia.flatMap((dep) => dep.ciudades),
    []
  );

  const fuse = useMemo(
    () =>
      new Fuse(allCities, {
        threshold: 0.3,
        includeScore: true,
      }),
    [allCities]
  );

  // Al cargar, revisar si hay ?ciudad= en la URL
  useEffect(() => {
    const ciudadEnURL = searchParams.get("ciudad");
    if (ciudadEnURL && allCities.includes(ciudadEnURL)) {
      setInput(ciudadEnURL);
      onChange?.(ciudadEnURL);
    }
  }, [searchParams, allCities, onChange]);

  useEffect(() => {
    if (input.length > 1) {
      const resultados = fuse.search(input);
      setSugerencias(resultados.map((r) => r.item));
    } else {
      setSugerencias([]);
    }
  }, [input, fuse]);

  const handleSeleccion = (ciudad: string) => {
    setInput(ciudad);
    setSugerencias([]);
    onChange?.(ciudad);

    // Actualizar la URL con ?ciudad=
    const params = new URLSearchParams(searchParams.toString());
    params.set("ciudad", ciudad);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar ciudad..."
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {sugerencias.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
          {sugerencias.map((ciudad, i) => (
            <li
              key={i}
              onClick={() => handleSeleccion(ciudad)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {ciudad}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
