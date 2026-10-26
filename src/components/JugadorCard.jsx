import { Link } from 'react-router'

function JugadorCard({
  id,
  nombre,
  foto,
  equipo,
  equipo_logo,
  competicion,
  posicion,
  goles,
  asistencias,
  partidos,
}) {
  return (
    <article className="tarjeta">
      <div className="tarjeta-cabecera">
        {foto && <img className="retrato" src={foto} alt="" />}
        <div>
          <h3>
            <Link to={`/jugadores/${id}`}>{nombre}</Link>
          </h3>
          <p className="sutil">
            {equipo_logo && <img className="escudo" src={equipo_logo} alt="" />}
            {equipo}
          </p>
        </div>
      </div>

      <p className="etiquetas">
        <span className="pildora">{competicion}</span>
        <span className="pildora">{posicion}</span>
      </p>

      <dl className="numeros">
        <div>
          <dt>Goles</dt>
          <dd>{goles}</dd>
        </div>
        <div>
          <dt>Asist.</dt>
          <dd>{asistencias}</dd>
        </div>
        <div>
          <dt>Partidos</dt>
          <dd>{partidos ?? '-'}</dd>
        </div>
      </dl>
    </article>
  )
}

export default JugadorCard
