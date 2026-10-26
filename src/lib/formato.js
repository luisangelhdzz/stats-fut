// La API manda las fechas en formato ISO ("2024-08-16T19:00:00.000Z").
// Esto las convierte a algo legible en español.
export function formatearFecha(iso) {
  if (!iso) return ''

  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
