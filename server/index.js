// API de mikiStats: traduce peticiones HTTP a consultas SQL.
// Uso:  node --env-file=.env server/index.js

import express from 'express'
import pg from 'pg'

const TEMPORADA = 2024
const PUERTO = process.env.PORT ?? 3001

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const app = express()

// Envuelve cada ruta para no repetir el try/catch en todas.
function ruta(manejador) {
  return async (req, res) => {
    try {
      await manejador(req, res)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error consultando la base de datos' })
    }
  }
}

// --- Competiciones -----------------------------------------------------

app.get(
  '/api/competiciones',
  ruta(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT c.id, c.nombre, c.pais, c.logo
       FROM competiciones c
       ORDER BY c.nombre`,
    )
    res.json(rows)
  }),
)

// --- Jugadores ---------------------------------------------------------

app.get(
  '/api/jugadores',
  ruta(async (req, res) => {
    const valores = [TEMPORADA]
    let filtro = ''

    if (req.query.competicion) {
      valores.push(Number(req.query.competicion))
      filtro = `AND s.competicion_id = $${valores.length}`
    }

    const { rows } = await pool.query(
      `SELECT j.id, j.nombre, j.nacionalidad, j.edad, j.foto,
              e.nombre AS equipo, e.logo AS equipo_logo,
              c.id AS competicion_id, c.nombre AS competicion,
              s.posicion, s.goles, s.asistencias, s.partidos, s.minutos, s.rating
       FROM estadisticas s
       JOIN jugadores j     ON j.id = s.jugador_id
       JOIN equipos e       ON e.id = s.equipo_id
       JOIN competiciones c ON c.id = s.competicion_id
       WHERE s.temporada = $1 ${filtro}
       ORDER BY s.goles DESC, j.nombre`,
      valores,
    )
    res.json(rows)
  }),
)

app.get(
  '/api/jugadores/:id',
  ruta(async (req, res) => {
    const id = Number(req.params.id)

    const jugador = await pool.query(
      `SELECT id, nombre, nacionalidad, edad, foto FROM jugadores WHERE id = $1`,
      [id],
    )

    if (jugador.rows.length === 0) {
      return res.status(404).json({ error: 'Jugador no encontrado' })
    }

    const stats = await pool.query(
      `SELECT c.nombre AS competicion, e.nombre AS equipo, e.logo AS equipo_logo,
              s.temporada, s.posicion, s.goles, s.asistencias,
              s.partidos, s.minutos, s.rating
       FROM estadisticas s
       JOIN competiciones c ON c.id = s.competicion_id
       JOIN equipos e       ON e.id = s.equipo_id
       WHERE s.jugador_id = $1
       ORDER BY s.temporada DESC, s.goles DESC`,
      [id],
    )

    res.json({ ...jugador.rows[0], estadisticas: stats.rows })
  }),
)

// --- Partidos ----------------------------------------------------------

app.get(
  '/api/partidos',
  ruta(async (req, res) => {
    const valores = [TEMPORADA]
    let filtro = ''

    if (req.query.competicion) {
      valores.push(Number(req.query.competicion))
      filtro = `AND p.competicion_id = $${valores.length}`
    }

    const { rows } = await pool.query(
      `SELECT p.id, p.fecha, p.jornada, p.estadio, p.estado,
              p.goles_local, p.goles_visitante,
              l.nombre AS local, l.logo AS local_logo,
              v.nombre AS visitante, v.logo AS visitante_logo,
              c.nombre AS competicion
       FROM partidos p
       JOIN equipos l       ON l.id = p.local_id
       JOIN equipos v       ON v.id = p.visitante_id
       JOIN competiciones c ON c.id = p.competicion_id
       WHERE p.temporada = $1 ${filtro}
       ORDER BY p.fecha DESC
       LIMIT 100`,
      valores,
    )
    res.json(rows)
  }),
)

app.get(
  '/api/partidos/:id',
  ruta(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT p.id, p.fecha, p.jornada, p.estadio, p.estado,
              p.goles_local, p.goles_visitante,
              l.nombre AS local, l.logo AS local_logo,
              v.nombre AS visitante, v.logo AS visitante_logo,
              c.nombre AS competicion
       FROM partidos p
       JOIN equipos l       ON l.id = p.local_id
       JOIN equipos v       ON v.id = p.visitante_id
       JOIN competiciones c ON c.id = p.competicion_id
       WHERE p.id = $1`,
      [Number(req.params.id)],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' })
    }

    res.json(rows[0])
  }),
)

app.listen(PUERTO, () => {
  console.log(`API escuchando en http://localhost:${PUERTO}`)
})
