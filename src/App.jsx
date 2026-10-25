import { Routes, Route, NavLink } from 'react-router'
import Jugadores from './pages/Jugadores.jsx'
import JugadorDetalle from './pages/JugadorDetalle.jsx'
import Partidos from './pages/Partidos.jsx'
import PartidoDetalle from './pages/PartidoDetalle.jsx'

function App() {
  return (
    <>
      <header>
        <h1>mikiStats</h1>
        <nav>
          <NavLink to="/" end>Jugadores</NavLink>{' | '}
          <NavLink to="/partidos">Partidos</NavLink>
        </nav>
      </header>

      <main>
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