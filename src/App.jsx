import JugadorCard from './components/JugadorCard.jsx'
import { jugadores } from './data/jugadores.js'

function App() {
  return (
    <main>
      <h1>mikiStats</h1>
      <p>Estadísticas de jugadores y partidos</p>

      <h2>Jugadores ({jugadores.length})</h2>
      {jugadores.map((jugador) => (
        <JugadorCard
          key={jugador.id}
          nombre={jugador.nombre}
          equipo={jugador.equipo}
          posicion={jugador.posicion}
          goles={jugador.goles}
          asistencias={jugador.asistencias}
        />
      ))}
    </main>
  )
}

export default App
