import { useParams, Link } from 'react-router'
import { partidos } from '../data/partidos.js'

function PartidoDetalle() {
  const { id } = useParams()
  const partido = partidos.find((p) => p.id === Number(id))

  if (!partido) {
    return (
      <>
        <p>No encontré ese partido.</p>
        <Link to="/partidos">← Volver a partidos</Link>
      </>
    )
  }

  let resultado = 'Empate'
  if (partido.golesLocal > partido.golesVisitante) resultado = `Ganó ${partido.local}`
  if (partido.golesVisitante > partido.golesLocal) resultado = `Ganó ${partido.visitante}`

  return (
    <article>
      <h2>{partido.local} vs {partido.visitante}</h2>
      <ul>
        <li>Marcador: {partido.golesLocal} - {partido.golesVisitante}</li>
        <li>Resultado: {resultado}</li>
        <li>Fecha: {partido.fecha}</li>
      </ul>
      <Link to="/partidos">← Volver a partidos</Link>
    </article>
  )
}

export default PartidoDetalle
