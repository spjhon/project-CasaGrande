

type FilteredNewsParams = {
  params: {
    filtros?: string[];
  };
};

export default async function Filtros({ params }: FilteredNewsParams) {

 

const filtros = (await params.filtros) || [];

console.log(filtros)


  return (
    <div className="h-100 border-2 border-amber-300">
      <h1>Parámetros de la URL:</h1>
      <ul>
        {filtros.map((item, index) => (
          <li key={index}>
            {index + 1}. {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
