-- Esquema de mikiStats, ajustado a lo que devuelve API-Football.
-- Se puede correr las veces que quieras: borra y vuelve a crear todo.

DROP TABLE IF EXISTS estadisticas;
DROP TABLE IF EXISTS partidos;
DROP TABLE IF EXISTS jugadores;
DROP TABLE IF EXISTS equipos;
DROP TABLE IF EXISTS competiciones;

-- Los id NO son SERIAL: usamos el mismo id que manda la API.
CREATE TABLE competiciones (
  id     INTEGER PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  pais   VARCHAR(60),
  logo   TEXT
);

CREATE TABLE equipos (
  id     INTEGER PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  logo   TEXT
);

CREATE TABLE jugadores (
  id           INTEGER PRIMARY KEY,
  nombre       VARCHAR(100) NOT NULL,
  nacionalidad VARCHAR(60),
  edad         INTEGER,
  foto         TEXT
);

-- Un jugador tiene estadisticas distintas en cada competicion y temporada.
CREATE TABLE estadisticas (
  jugador_id     INTEGER NOT NULL REFERENCES jugadores(id),
  competicion_id INTEGER NOT NULL REFERENCES competiciones(id),
  temporada      INTEGER NOT NULL,
  equipo_id      INTEGER REFERENCES equipos(id),
  posicion       VARCHAR(20),
  partidos       INTEGER,
  minutos        INTEGER,
  goles          INTEGER,
  asistencias    INTEGER,
  rating         NUMERIC(4,2),
  PRIMARY KEY (jugador_id, competicion_id, temporada)
);

CREATE TABLE partidos (
  id              INTEGER PRIMARY KEY,
  competicion_id  INTEGER NOT NULL REFERENCES competiciones(id),
  temporada       INTEGER NOT NULL,
  fecha           TIMESTAMPTZ NOT NULL,
  jornada         VARCHAR(60),
  estadio         VARCHAR(100),
  local_id        INTEGER NOT NULL REFERENCES equipos(id),
  visitante_id    INTEGER NOT NULL REFERENCES equipos(id),
  goles_local     INTEGER,
  goles_visitante INTEGER,
  estado          VARCHAR(20)
);

-- Indices: aceleran los filtros que mas vamos a usar desde Express.
CREATE INDEX idx_estadisticas_competicion ON estadisticas (competicion_id, temporada);
CREATE INDEX idx_partidos_competicion     ON partidos (competicion_id, temporada);
CREATE INDEX idx_partidos_fecha           ON partidos (fecha);
