import { useState } from 'react'
import { useApi } from '../hooks/useApi.js'
import PartidoCard from '../components/PartidoCard.jsx'
import SelectorCompeticion from '../components/SelectorCompeticion.jsx'

function Partidos() {
  const [competicion, setCompeticion] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const ruta = competicion
    ? `/api/partidos?competicion=${competicion}`
    : '/api/partidos'

  const { datos, cargando, error } = useApi(ruta)

  const visibles = (datos ?? []).filter(
    (partido) =>
      partido.local.toLowerCase().includes(busqueda.toLowerCase()) ||
      partido.visitante.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <>
      <div className="filtros">
        <SelectorCompeticion valor={competicion} alCambiar={setCompeticion} />

        <input
          type="text"
          placeholder="Buscar equipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando && <p className="aviso">Cargando partidos...</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <>
          <h2>Partidos ({visibles.length})</h2>
          <div className="grid">
            {visibles.map((partido) => (
              <PartidoCard key={partido.id} {...partido} />
            ))}
          </div>
          {visibles.length === 0 && (
            <p className="aviso">Ningun partido coincide con el filtro.</p>
          )}
        </>
      )}
    </>
  )
}

export default Partidos
