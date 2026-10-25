import { useState } from 'react'
import PartidoCard from '../components/PartidoCard.jsx'
import { partidos } from '../data/partidos.js'

function Partidos() {
  const [busqueda, setBusqueda] = useState('')

  const visibles = partidos.filter((partido) =>
    partido.local.toLowerCase().includes(busqueda.toLowerCase()) ||
    partido.visitante.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <input
        type="text"
        placeholder="Buscar equipo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <h2>Partidos ({visibles.length})</h2>
      {visibles.map((partido) => (
        <PartidoCard
          key={partido.id}
          id={partido.id}
          local={partido.local}
          visitante={partido.visitante}
          golesLocal={partido.golesLocal}
          golesVisitante={partido.golesVisitante}
          fecha={partido.fecha}
        />
      ))}
    </>
  )
}

export default Partidos
