import { useParams, Link } from 'react-router'
import { useApi } from '../hooks/useApi.js'
import { formatearFecha } from '../lib/formato.js'

function PartidoDetalle() {
  const { id } = useParams()
  const { datos: partido, cargando, error } = useApi(`/api/partidos/${id}`)

  if (cargando) return <p className="aviso">Cargando...</p>

  if (error) {
    return (
      <>
        <p className="error">No encontre ese partido ({error}).</p>
        <Link to="/partidos">&larr; Volver a partidos</Link>
      </>
    )
  }

  const jugado = partido.goles_local !== null && partido.goles_visitante !== null

  // Tu misma logica de antes, con los nombres que usa la API.
  let resultado = 'Todavia no se juega'
  if (jugado) {
    resultado = 'Empate'
    if (partido.goles_local > partido.goles_visitante) resultado = `Gano ${partido.local}`
    if (partido.goles_visitante > partido.goles_local) resultado = `Gano ${partido.visitante}`
  }

  return (
    <article className="detalle">
      <p className="etiquetas">
        <span className="pildora">{partido.competicion}</span>
        {partido.jornada && <span className="pildora">{partido.jornada}</span>}
      </p>

      <div className="marcador grande">
        <span className="equipo">
          {partido.local_logo && <img className="escudo" src={partido.local_logo} alt="" />}
          {partido.local}
        </span>
        <strong className="resultado">
          {jugado ? `${partido.goles_local} - ${partido.goles_visitante}` : 'vs'}
        </strong>
        <span className="equipo">
          {partido.visitante_logo && (
            <img className="escudo" src={partido.visitante_logo} alt="" />
          )}
          {partido.visitante}
        </span>
      </div>

      <ul className="lista-datos">
        <li><strong>Resultado:</strong> {resultado}</li>
        <li><strong>Fecha:</strong> {formatearFecha(partido.fecha)}</li>
        {partido.estadio && <li><strong>Estadio:</strong> {partido.estadio}</li>}
      </ul>

      <Link to="/partidos">&larr; Volver a partidos</Link>
    </article>
  )
}

export default PartidoDetalle
