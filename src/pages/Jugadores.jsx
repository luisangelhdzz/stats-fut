import { useState } from 'react'
import JugadorCard from '../components/JugadorCard.jsx'
import { jugadores } from '../data/jugadores.js'

function Jugadores() {
  const [busqueda, setBusqueda] = useState('')
  const [soloDelanteros, setSoloDelanteros] = useState(false)

  const visibles = jugadores.filter((jugador) => {
    const coincideBusqueda =
      jugador.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      jugador.equipo.toLowerCase().includes(busqueda.toLowerCase())

    const coincidePosicion = !soloDelanteros || jugador.posicion === 'Delantero'

    return coincideBusqueda && coincidePosicion
  })

  return (
    <>
      <input
        type="text"
        placeholder="Buscar jugador o equipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={soloDelanteros}
          onChange={(e) => setSoloDelanteros(e.target.checked)}
        />
        Solo delanteros
      </label>

      <h2>Jugadores ({visibles.length})</h2>
      {visibles.map((jugador) => (
        <JugadorCard
          key={jugador.id}
          id={jugador.id}
          nombre={jugador.nombre}
          equipo={jugador.equipo}
          posicion={jugador.posicion}
          goles={jugador.goles}
          asistencias={jugador.asistencias}
          campo={jugador.campo}
        />
      ))}
    </>
  )
}

export default Jugadores