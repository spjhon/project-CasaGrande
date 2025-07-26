import {CitySearch} from "@/components/CitySearch";
import { BreadcrumbWithCustomSeparator } from "../../../../components/Breadcrumb";
import { ComboboxDemo } from "@/components/Combobox";
import { notFound } from "next/navigation";

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    filtros?: string[];
  };
}

export default async function ExploreLayout({
  children,
  params,
}: RootLayoutProps) {

  const filtros = (await params.filtros) || [];


  if (filtros.includes("cualquiera666")) {
  notFound();
}







  return (
    <section>
      <div className="flex items-center justify-between border-2 border-amber-800 h-60">
        <div>
          <BreadcrumbWithCustomSeparator />

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
          <CitySearch></CitySearch>
          <ComboboxDemo></ComboboxDemo>
        </div>
      </div>

      {children}
    </section>
  );
}
