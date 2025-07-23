import { BreadcrumbWithCustomSeparator } from '../../../components/Breadcrumb';
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function ExploreLayout({ children }: RootLayoutProps) {
  return (
    <section>
    <div className="flex items-center border-2 border-amber-800 h-20">
       


        <BreadcrumbWithCustomSeparator />

    </div>
      <div
        className="
      
       
      border-2 border-amber-800
      flex justify-center
      "
      >



        <div className="w-[30%] h-100 border-2 border-amber-300">
          Explore sidebar layout
        </div>

        {children}


      </div>
    </section>
  );
}
