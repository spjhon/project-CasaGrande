import { finalResultFromClasificarParams } from "@/app/[locale]/explore/[[...filtros]]/layout";

export function construirMensajeBusqueda(result: finalResultFromClasificarParams): string {
  const partes: string[] = [];

  // Tipo
  if (result.tipo) partes.push(`${result.tipo.label}`);

  // Ciudad
  if (result.ciudad) partes.push(`en la ciudad de ${result.ciudad.label}`);

  // Barrio
  if (result.barrio) partes.push(`en el barrio ${result.barrio.label}`);

  // Universidad
  if (result.universidad) partes.push(`cerca a ${result.universidad.label}`);

  // Amoblado
  if (result.amoblado) partes.push(`${result.amoblado.slug === "amoblado" ? "amoblada" : "sin amoblar"}`);

  // Alimentación
  if (result.alimentacion) partes.push(`${result.alimentacion.label.toLowerCase()}`);

  // Baño privado
  if (result.bañoPrivado) partes.push(`${result.bañoPrivado.label.toLowerCase()}`);

  // Arreglo ropa
  if (result.arregloRopa) partes.push(`${result.arregloRopa.label.toLowerCase()}`);

  // Arreglo habitacion
  if (result.arregloHabitacion) partes.push(`${result.arregloHabitacion.label.toLowerCase()}`);

  // Género
  if (result.genero) partes.push(`solo para ${result.genero.label.toLowerCase()}`);

  // Mascotas
  if (result.mascota) partes.push(`que acepte ${result.mascota.label.toLowerCase()}`);

  // Estrato
  if (result.estrato) partes.push(`de ${result.estrato.label.toLowerCase()}`);

  // Contrato mínimo
  if (result.tiempoContratoMinimo) partes.push(`con mínimo ${result.tiempoContratoMinimo.label.toLowerCase()} de contrato`);

  // Precio
  if (result.minPrice && result.maxPrice) {
    partes.push(`y un precio entre ${result.minPrice.value.toLocaleString("es-CO")} y ${result.maxPrice.value.toLocaleString("es-CO")}`);
  } else if (result.minPrice) {
    partes.push(`con precio desde ${result.minPrice.value.toLocaleString("es-CO")}`);
  } else if (result.maxPrice) {
    partes.push(`con precio hasta ${result.maxPrice.value.toLocaleString("es-CO")}`);
  }

  // Unir todo
  let mensaje = partes.join(" ");
  mensaje = mensaje.charAt(0).toUpperCase() + mensaje.slice(1); // primera mayúscula

  return mensaje || "Explora habitaciones disponibles con los filtros que prefieras.";
}