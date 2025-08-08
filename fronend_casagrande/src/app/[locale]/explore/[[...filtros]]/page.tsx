import type { Metadata } from 'next'


 
export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}

export default async function FiltrosPage({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>
}) {


const filtros = (await params).filtros || [];



  return (
    <div className="h-100 border-2 border-amber-300">
      <h1>Parámetros de la URL:</h1>
      <ul>
        
      </ul>
    </div>
  );
}
