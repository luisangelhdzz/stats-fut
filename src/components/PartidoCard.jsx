import { Link } from 'react-router'
import { formatearFecha } from '../lib/formato.js'

function PartidoCard({
  id,
  local,
  local_logo,
  visitante,
  visitante_logo,
  goles_local,
  goles_visitante,
  fecha,
  competicion,
  estado,
}) {
  const jugado = estado === 'FT' || estado === 'AET' || estado === 'PEN'

  return (
    <article className="tarjeta">
      <p className="etiquetas">
        <span className="pildora">{competicion}</span>
      </p>

      <Link className="marcador" to={`/partidos/${id}`}>
        <span className="equipo">
          {local_logo && <img className="escudo" src={local_logo} alt="" />}
          {local}
        </span>

        <strong className="resultado">
          {jugado ? `${goles_local} - ${goles_visitante}` : 'vs'}
        </strong>

        <span className="equipo">
          {visitante_logo && <img className="escudo" src={visitante_logo} alt="" />}
          {visitante}
        </span>
      </Link>

      <p className="sutil">{formatearFecha(fecha)}</p>
    </article>
  )
}

export default PartidoCard
