"use client"

import * as React from "react"


import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { NavigationMenu, NavigationMenuList } from "./ui/navigation-menu"
import { Link } from "@/i18n/navigation"
import {RouteProps} from "./Navbar"


interface MobileMenuProps {
  routes: RouteProps[];
}


export function MobileMenu({routes}: MobileMenuProps) {
 

  

  return (
    <Drawer>



      <DrawerTrigger asChild className="xl:hidden">
        <Button variant="outline" >Menu</Button>
      </DrawerTrigger>


      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">

          <DrawerHeader>
            <DrawerTitle>Colombian Real State</DrawerTitle>
            <DrawerDescription>Vende Tu casa con confianza</DrawerDescription>
          </DrawerHeader>

          {/* mobile */}
          <div className="p-4 pb-0">
            <NavigationMenu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">

              <NavigationMenuList className="">
                <nav className="flex gap-2">
                  {routes.map((route, i) => (
                    <DrawerClose asChild key={i}>
                      <Link
                        rel="noreferrer noopener"
                        href={route.href}
                        className={`text-[17px] ${buttonVariants({
                          variant: "ghost",
                        })}`}
                        >
                        {route.label}
                      </Link>
                    </DrawerClose>
                  ))}
                </nav>
              </NavigationMenuList>
              
            </NavigationMenu>
          </div>


          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>



      
    </Drawer>
  )
}
