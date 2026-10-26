import { useState, useEffect } from 'react'

// Pide datos a la API y devuelve los tres estados que toda peticion tiene:
// lo que llego, si sigue cargando, y si algo fallo.
export function useApi(ruta) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si la ruta cambia antes de que llegue la respuesta vieja,
    // esta bandera evita que la vieja pise a la nueva.
    let cancelado = false

    setCargando(true)
    setError(null)

    fetch(ruta)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(`El servidor respondio ${respuesta.status}`)
        }
        return respuesta.json()
      })
      .then((json) => {
        if (!cancelado) setDatos(json)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [ruta])

  return { datos, cargando, error }
}
