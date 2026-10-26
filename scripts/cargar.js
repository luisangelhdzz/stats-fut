// Descarga datos de API-Football y los guarda en PostgreSQL.
// Uso:  node --env-file=.env scripts/cargar.js

import pg from 'pg'

const API_BASE = process.env.API_BASE ?? 'https://v3.football.api-sports.io'
const API_KEY = process.env.API_FOOTBALL_KEY
const TEMPORADA = 2024

const COMPETICIONES = [
  { id: 39, nombre: 'Premier League' },
  { id: 140, nombre: 'La Liga' },
  { id: 135, nombre: 'Serie A' },
  { id: 78, nombre: 'Bundesliga' },
  { id: 61, nombre: 'Ligue 1' },
  { id: 2, nombre: 'Champions League' },
  { id: 262, nombre: 'Liga MX' },
]

// --- Hablar con la API -------------------------------------------------

async function pedir(ruta) {
  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    headers: { 'x-apisports-key': API_KEY },
  })

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status} al pedir ${ruta}`)
  }

  const datos = await respuesta.json()

  // La API responde 200 OK aunque haya problemas: el motivo viene en "errors".
  if (datos.errors && Object.keys(datos.errors).length > 0) {
    throw new Error(`La API rechazo ${ruta}: ${JSON.stringify(datos.errors)}`)
  }

  return datos.response
}

// --- Guardar en la base ------------------------------------------------

async function guardarCompeticion(cliente, liga) {
  await cliente.query(
    `INSERT INTO competiciones (id, nombre, pais, logo)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE
       SET nombre = EXCLUDED.nombre,
           pais   = EXCLUDED.pais,
           logo   = EXCLUDED.logo`,
    [liga.id, liga.name, liga.country, liga.logo],
  )
}

async function guardarEquipo(cliente, equipo) {
  await cliente.query(
    `INSERT INTO equipos (id, nombre, logo)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE
       SET nombre = EXCLUDED.nombre,
           logo   = EXCLUDED.logo`,
    [equipo.id, equipo.name, equipo.logo],
  )
}

async function guardarJugador(cliente, jugador) {
  await cliente.query(
    `INSERT INTO jugadores (id, nombre, nacionalidad, edad, foto)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE
       SET nombre       = EXCLUDED.nombre,
           nacionalidad = EXCLUDED.nacionalidad,
           edad         = EXCLUDED.edad,
           foto         = EXCLUDED.foto`,
    [jugador.id, jugador.name, jugador.nationality, jugador.age, jugador.photo],
  )
}

async function cargarGoleadores(cliente, competicion) {
  const filas = await pedir(
    `/players/topscorers?league=${competicion.id}&season=${TEMPORADA}`,
  )

  for (const fila of filas) {
    const jugador = fila.player
    const stats = fila.statistics[0]
    if (!stats) continue

    await guardarCompeticion(cliente, stats.league)
    await guardarEquipo(cliente, stats.team)
    await guardarJugador(cliente, jugador)

    await cliente.query(
      `INSERT INTO estadisticas
         (jugador_id, competicion_id, temporada, equipo_id,
          posicion, partidos, minutos, goles, asistencias, rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (jugador_id, competicion_id, temporada) DO UPDATE
         SET equipo_id   = EXCLUDED.equipo_id,
             posicion    = EXCLUDED.posicion,
             partidos    = EXCLUDED.partidos,
             minutos     = EXCLUDED.minutos,
             goles       = EXCLUDED.goles,
             asistencias = EXCLUDED.asistencias,
             rating      = EXCLUDED.rating`,
      [
        jugador.id,
        stats.league.id,
        TEMPORADA,
        stats.team.id,
        stats.games?.position,
        stats.games?.appearences,
        stats.games?.minutes,
        stats.goals?.total ?? 0,
        stats.goals?.assists ?? 0,
        stats.games?.rating ? Number(stats.games.rating) : null,
      ],
    )
  }

  return filas.length
}

async function cargarPartidos(cliente, competicion) {
  const filas = await pedir(
    `/fixtures?league=${competicion.id}&season=${TEMPORADA}`,
  )

  for (const fila of filas) {
    await guardarCompeticion(cliente, fila.league)
    await guardarEquipo(cliente, fila.teams.home)
    await guardarEquipo(cliente, fila.teams.away)

    await cliente.query(
      `INSERT INTO partidos
         (id, competicion_id, temporada, fecha, jornada, estadio,
          local_id, visitante_id, goles_local, goles_visitante, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE
         SET fecha           = EXCLUDED.fecha,
             jornada         = EXCLUDED.jornada,
             estadio         = EXCLUDED.estadio,
             goles_local     = EXCLUDED.goles_local,
             goles_visitante = EXCLUDED.goles_visitante,
             estado          = EXCLUDED.estado`,
      [
        fila.fixture.id,
        fila.league.id,
        TEMPORADA,
        fila.fixture.date,
        fila.league.round,
        fila.fixture.venue?.name,
        fila.teams.home.id,
        fila.teams.away.id,
        fila.goals?.home,
        fila.goals?.away,
        fila.fixture.status?.short,
      ],
    )
  }

  return filas.length
}

// --- Programa principal ------------------------------------------------

async function main() {
  if (!API_KEY) {
    console.error('Falta API_FOOTBALL_KEY. Corre: node --env-file=.env scripts/cargar.js')
    process.exit(1)
  }

  const cliente = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  })
  await cliente.connect()

  let peticiones = 0

  for (const competicion of COMPETICIONES) {
    try {
      const goleadores = await cargarGoleadores(cliente, competicion)
      peticiones++
      console.log(`${competicion.nombre}: ${goleadores} goleadores`)

      const partidos = await cargarPartidos(cliente, competicion)
      peticiones++
      console.log(`${competicion.nombre}: ${partidos} partidos`)
    } catch (error) {
      console.error(`${competicion.nombre}: ${error.message}`)
    }
  }

  console.log(`\nListo. Peticiones gastadas: ${peticiones}`)
  await cliente.end()
}

main()
