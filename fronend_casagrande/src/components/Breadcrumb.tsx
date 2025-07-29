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
      {items.map((item, index) => (
        <Fragment key={index}>
          <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${item}`}>{item}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
       </Fragment>
      ) )}
        
      </BreadcrumbList>
    </Breadcrumb>
  )
}
