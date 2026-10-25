import { Link } from 'react-router'

function JugadorCard({ id, nombre, equipo, posicion, goles, asistencias, campo }) {
  return (
    <article>
      <h3><Link to={`/jugadores/${id}`}>{nombre}</Link></h3>
      <p>{equipo} · {posicion}</p>
      <p>Goles: {goles} | Asistencias: {asistencias}</p>
      <p>Campo: {campo}</p>
    </article>
  )
}

export default JugadorCard