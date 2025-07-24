import CitySearch from "@/components/CitySearch";
import { BreadcrumbWithCustomSeparator } from "../../../components/Breadcrumb";
import { ComboboxDemo } from "@/components/Combobox";
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function ExploreLayout({ children }: RootLayoutProps) {
  return (
    <section>

      <div className="flex items-center justify-between border-2 border-amber-800 h-20">
        <div>
        
        <BreadcrumbWithCustomSeparator />
        
        <div>
          este es el div del mensaje de donde esta la busqueda actualmente
        </div>

        </div>



        <div>Div de los botones de filtro y orden

          <CitySearch></CitySearch>
          <ComboboxDemo></ComboboxDemo>
        </div>



      </div>

      

        {children}
      


    </section>
  );
}
