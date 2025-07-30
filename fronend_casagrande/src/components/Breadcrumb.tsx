import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react";

type BreadcrumbWithCustomSeparatorProps = {
  items: string[];
};

export function BreadcrumbWithCustomSeparator({items}: BreadcrumbWithCustomSeparatorProps) {


  return (
    <Breadcrumb>
      <BreadcrumbList>
      <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/`}>Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/explore/`}>Explorar</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>


      {items.map((item, index) => {
          const href = "/explore/" + items.slice(0, index + 1).join("/")

          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{decodeURIComponent(item)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{decodeURIComponent(item)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
        
      </BreadcrumbList>
    </Breadcrumb>
  )
}
