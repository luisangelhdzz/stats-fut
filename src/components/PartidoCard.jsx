import { Link } from 'react-router'

function PartidoCard({ id, local, visitante, golesLocal, golesVisitante, fecha }) {
  return (
    <article>
      <h3>
        <Link to={`/partidos/${id}`}>
          {local} {golesLocal} - {golesVisitante} {visitante}
        </Link>
      </h3>
      <p>Fecha: {fecha}</p>
    </article>
  )
}

export default PartidoCard
