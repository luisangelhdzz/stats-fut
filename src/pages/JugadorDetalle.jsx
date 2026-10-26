import { useParams, Link } from 'react-router'
import { useApi } from '../hooks/useApi.js'

function JugadorDetalle() {
  const { id } = useParams()
  const { datos: jugador, cargando, error } = useApi(`/api/jugadores/${id}`)

  if (cargando) return <p className="aviso">Cargando...</p>

  if (error) {
    return (
      <>
        <p className="error">No encontre a ese jugador ({error}).</p>
        <Link to="/">&larr; Volver a jugadores</Link>
      </>
    )
  }

  return (
    <article className="detalle">
      <header className="detalle-cabecera">
        {jugador.foto && <img className="retrato grande" src={jugador.foto} alt="" />}
        <div>
          <h2>{jugador.nombre}</h2>
          <p className="sutil">
            {jugador.nacionalidad}
            {jugador.edad ? ` · ${jugador.edad} años` : ''}
          </p>
        </div>
      </header>

      <table className="tabla">
        <thead>
          <tr>
            <th>Competición</th>
            <th>Equipo</th>
            <th>Pos.</th>
            <th>PJ</th>
            <th>Min.</th>
            <th>Goles</th>
            <th>Asist.</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {jugador.estadisticas.map((fila, i) => (
            <tr key={i}>
              <td>{fila.competicion}</td>
              <td>{fila.equipo}</td>
              <td>{fila.posicion}</td>
              <td>{fila.partidos ?? '-'}</td>
              <td>{fila.minutos ?? '-'}</td>
              <td>{fila.goles}</td>
              <td>{fila.asistencias}</td>
              <td>{fila.rating ? Number(fila.rating).toFixed(2) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/">&larr; Volver a jugadores</Link>
    </article>
  )
}

export default JugadorDetalle
