

//Importacion del dropdown para el cambio de tema
import { ModeToggle } from "./mode-toggle";

//Importacion de los componentes de shadcn
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";


import {useTranslations} from 'next-intl';
//Link especial para i18n
import {Link} from '@/i18n/navigation';




//Importacion de iconos de radix y lucide
import { buttonVariants } from "../ui/button";
import { /*Menu*/ CarFront } from "lucide-react";
import { MobileMenu } from './MobileMenu';
import { I18nToggle } from './i18nToggle';



//Props para la barra de navegacion
export interface RouteProps {
  href: "/" | "/about" | "/explore";
  label: string;
}



export const Navbar = () => {

  const t = useTranslations('Navbar');

  const routeList: RouteProps[] = [
    {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: t('aboutLink'),
  },
  {
    href: "/explore",
    label: "Explore",
  },
  
  
];
  
  return (
    <header className="sticky border-b-[1px] top-0 z-40 bg-white dark:border-b-slate-700 dark:bg-background">
      <div className="container flex flex-row justify-between items-center mx-auto px-5 relative">

        <Link
          rel="noreferrer noopener"
          href="/"
          className="ml-2 font-bold text-xl"
        >
          <CarFront />
          {t('tittle')}
        </Link>

        <NavigationMenu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <NavigationMenuList className="">
            {/* desktop */}
            <nav className="hidden xl:flex gap-6">
              {routeList.map((route: RouteProps, i) => (
                <Link
                  rel="noreferrer noopener"
                  href={route.href}
                  key={i}
                  className={`text-[17px] ${buttonVariants({
                    variant: "ghost",
                  })}`}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </NavigationMenuList>
        </NavigationMenu>

        
            
        <div className="hidden xl:flex gap-2">
            <a
              rel="noreferrer noopener"
              href="https://wa.me/573215224583"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })} flex items-center justify-center h-5 gap-2`}
              aria-label="Contactar por WhatsApp"
            >
              
              <span className="text-sm">+57 321 522 45 83</span>
            </a>

            <ModeToggle />
            <I18nToggle />

        </div>

        <MobileMenu routes = {routeList} />

      </div>
    </header>
  );
};