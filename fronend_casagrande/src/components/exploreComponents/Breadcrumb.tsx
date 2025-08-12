import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categoriasAbuscar, ResultadoFiltro } from "@/app/[locale]/explore/[[...filtros]]/layout";

type tipodeArriendoOption = {
  id: string
  label: string
  slug: string
}

type paramsClasificadosProps = {
filtros?: string[];
    paramsClasificados?: Partial<Record<categoriasAbuscar, ResultadoFiltro>>;
    tipodeArriendo?: tipodeArriendoOption[];
}

export function BreadcrumbWithCustomSeparator({ paramsClasificados }: paramsClasificadosProps) {
  // Convertimos el objeto a un array manteniendo el orden de categorías
  const orderedKeys: categoriasAbuscar[] = ["tipo", "ciudad", "barrio", "universidad",];
  const items = orderedKeys
    .map((key) => paramsClasificados?.[key])
    .filter((item): item is ResultadoFiltro => Boolean(item));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/explore">Explorar</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => {
          const href =
            "/explore/" +
            items.slice(0, index + 1).map((i) => i.slug).join("/");

          return (
            <Fragment key={item.slug}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
