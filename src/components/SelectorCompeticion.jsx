import { useApi } from '../hooks/useApi.js'

function SelectorCompeticion({ valor, alCambiar }) {
  const { datos, cargando } = useApi('/api/competiciones')

  if (cargando) return <p className="aviso">Cargando competiciones...</p>

  return (
    <select
      className="selector"
      value={valor}
      onChange={(e) => alCambiar(e.target.value)}
    >
      <option value="">Todas las competiciones</option>
      {(datos ?? []).map((competicion) => (
        <option key={competicion.id} value={competicion.id}>
          {competicion.nombre}
        </option>
      ))}
    </select>
  )
}

export default SelectorCompeticion
