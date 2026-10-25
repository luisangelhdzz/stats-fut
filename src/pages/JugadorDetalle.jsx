import { useParams, Link } from 'react-router'
import { jugadores } from '../data/jugadores.js'

function JugadorDetalle() {
  const { id } = useParams()
  const jugador = jugadores.find((j) => j.id === Number(id))

  if (!jugador) {
    return (
      <>
        <p>No encontré a ese jugador.</p>
        <Link to="/">← Volver a jugadores</Link>
      </>
    )
  }

  return (
    <article>
      <h2>{jugador.nombre}</h2>
      <p>{jugador.equipo} · {jugador.posicion}</p>
      <ul>
        <li>Goles: {jugador.goles}</li>
        <li>Asistencias: {jugador.asistencias}</li>
        <li>Campo: {jugador.campo}</li>
      </ul>
      <Link to="/">← Volver a jugadores</Link>
    </article>
  )
}

export default JugadorDetalle