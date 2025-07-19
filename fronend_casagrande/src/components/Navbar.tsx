"use client"

//Importacion de link de next
import Link from "next/link";

//Importacion del dropdown para el cambio de tema
import { ModeToggle } from "./mode-toggle";

//Importacion de los componentes de shadcn
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";




//Importacion de iconos de radix y lucide
import { buttonVariants } from "./ui/button";
import { /*Menu*/ CarFront } from "lucide-react";
import { DrawerDemo } from './MenuDrawer';



//Props para la barra de navegacion
interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#OurWork",
    label: "Nuestro Trabajo",
  },
  {
    href: "#pricing",
    label: "Servicios y Precios",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
  {
    href: "#contact",
    label: "Contacto",
  },
];

export const Navbar = () => {
  
  return (
    <header className="sticky border-b-[1px] top-0 z-40 bg-white dark:border-b-slate-700 dark:bg-background">
      <div className="container flex flex-row justify-between items-center mx-auto px-5 relative">

        <Link
          rel="noreferrer noopener"
          href="/"
          className="ml-2 font-bold text-xl"
        >
          <CarFront />
          Inmobiliaria Casa Grande
        </Link>

        <NavigationMenu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <NavigationMenuList className="">
            {/* desktop */}
            <nav className="hidden xl:flex gap-2">
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

        </div>

        <DrawerDemo />

      </div>
    </header>
  );
};