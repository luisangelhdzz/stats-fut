import { Routes, Route, NavLink } from 'react-router'
import Jugadores from './pages/Jugadores.jsx'
import JugadorDetalle from './pages/JugadorDetalle.jsx'
import Partidos from './pages/Partidos.jsx'
import PartidoDetalle from './pages/PartidoDetalle.jsx'

function App() {
  return (
    <>
      <header className="cabecera">
        <div className="cabecera-interior">
          <h1>
            mikiStats <span className="temporada">Temporada 2024/25</span>
          </h1>
          <nav>
            <NavLink to="/" end>
              Jugadores
            </NavLink>
            <NavLink to="/partidos">Partidos</NavLink>
          </nav>
        </div>
      </header>

      <main className="contenido">
        <Routes>
          <Route path="/" element={<Jugadores />} />
          <Route path="/jugadores/:id" element={<JugadorDetalle />} />
          <Route path="/partidos" element={<Partidos />} />
          <Route path="/partidos/:id" element={<PartidoDetalle />} />
        </Routes>
      </main>
    </>
  )
}

export default App
