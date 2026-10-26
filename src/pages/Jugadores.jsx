import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import JugadorCard from '../components/JugadorCard.jsx'
import SelectorCompeticion from '../components/SelectorCompeticion.jsx'

function Jugadores() {
  const [competicion, setCompeticion] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [soloDelanteros, setSoloDelanteros] = useState(false)

  const ruta = competicion
    ? `/api/jugadores?competicion=${competicion}`
    : '/api/jugadores'

  const { datos, cargando, error } = useApi(ruta)

  // El filtro sigue siendo el tuyo: ahora trabaja sobre lo que llego de la API.
  const visibles = (datos ?? []).filter((jugador) => {
    const coincideBusqueda =
      jugador.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      jugador.equipo.toLowerCase().includes(busqueda.toLowerCase())

    const coincidePosicion = !soloDelanteros || jugador.posicion === 'Attacker'

    return coincideBusqueda && coincidePosicion
  })

  return (
    <>
      <div className="filtros">
        <SelectorCompeticion valor={competicion} alCambiar={setCompeticion} />

        <input
          type="text"
          placeholder="Buscar jugador o equipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <label className="check">
          <input
            type="checkbox"
            checked={soloDelanteros}
            onChange={(e) => setSoloDelanteros(e.target.checked)}
          />
          Solo delanteros
        </label>
      </div>

      {cargando && <p className="aviso">Cargando jugadores...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <>
          <h2>Goleadores ({visibles.length})</h2>
          <div className="grid">
            {visibles.map((jugador) => (
              <JugadorCard
                key={`${jugador.id}-${jugador.competicion_id}`}
                {...jugador}
              />
            ))}
          </div>
          {visibles.length === 0 && (
            <p className="aviso">Ningun jugador coincide con el filtro.</p>
          )}
        </>
      )}
    </>
  )
}

export default Jugadores
