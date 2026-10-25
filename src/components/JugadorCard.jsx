function JugadorCard({ nombre,equipo,posicion,goles,asistencias}){
    return (
        <article>
            <h3>{nombre}</h3>
            <p>{equipo} · {posicion}</p>
            <p>Goles: {goles} | Asistencias: {asistencias}</p>
        </article>
    )
}


export default JugadorCard