"use client"

import {CitySearch} from "@/components/CitySearch";
import { BreadcrumbWithCustomSeparator } from "../../../../components/Breadcrumb";
import { useParams } from "next/navigation";
import { useState } from "react";

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    filtros?: string[];
  };
}

export default function ExploreLayout({children}: RootLayoutProps) {

  const params = useParams() as { filtros?: string[] };
  const filtros = params.filtros || [];
  const [value, setValue] = useState(filtros[1]?(filtros[1]==="ciudades"?"":filtros[1]):"")

 



  return (
    <section>
      <div className="flex items-center justify-between border-2 border-amber-800 h-60">
        <div>
          <BreadcrumbWithCustomSeparator items={filtros} />

          <div>
            este es el div del mensaje de donde esta la busqueda actualmente
          </div>

          <h1>Parámetros de la URL:</h1>
          <ul>
            {filtros.map((item, index) => (
              <li key={index}>
                {index + 1}. {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          Div de los botones de filtro y orden
          <CitySearch value={value} setValue={setValue}></CitySearch>
          
        </div>
      </div>

      {children}
    </section>
  );
}
