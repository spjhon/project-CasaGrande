"use client"

import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout";
import { Button } from "../ui/button";
import { useRouter } from "@/i18n/navigation";



type  ResetButtonProps= {
    paramsClasificados: finalResultFromClasificarParams;
    urlFilters: string[];
}



export default function ResetButton({paramsClasificados, urlFilters}: ResetButtonProps) {

    const router = useRouter();

    function handleReset  (paramsClasificados: finalResultFromClasificarParams, urlFilters: string[])  {

let newFilters = [...urlFilters]

if (paramsClasificados.ciudad?.slug) {
  newFilters = newFilters.filter((item) => item !== paramsClasificados.ciudad?.slug)
}

if (paramsClasificados.tipo?.slug) {
  newFilters = newFilters.filter((item) => item !== paramsClasificados.tipo?.slug)
}

if (paramsClasificados.barrio?.slug) {
  newFilters = newFilters.filter((item) => item !== paramsClasificados.barrio?.slug)
}

if (paramsClasificados.universidad?.slug) {
  newFilters = newFilters.filter((item) => item !== paramsClasificados.universidad?.slug)
}

    
    // @ts-expect-error es necesario
    router.replace(`/explore/${newFilters.join("/")}`);
}
    
  return (
    <Button variant="outline" onClick={() => handleReset(paramsClasificados, urlFilters)}>Resetear Filtros</Button>
  )
}
