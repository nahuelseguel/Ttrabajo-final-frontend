import { useState } from 'react'
import { api }    from '@/lib/api'
import Badge      from '@/components/ui/Badge'
import Button     from '@/components/ui/Button'
import Alert      from '@/components/ui/Alert'
import Spinner    from '@/components/ui/Spinner'
import styles     from './Tracking.module.css'

export default function Tracking() {
  const [code,    setCode]    = useState('')
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSearch(event) {
    event.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setError('Ingresá un código de seguimiento'); return }

    setError('')
    setOrder(null)
    setLoading(true)

    try {
      // Este endpoint es público en el backend
      const result = await api.get(`/orders/track/${trimmed}`)
      setOrder(result)
    } catch (err) {
      setError(err.message || 'Código no encontrado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>Rastrear envío</h1>
        <p className={styles.subtitle}>Ingresá el código de seguimiento para ver el estado de tu pedido</p>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            className={styles.input}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Ej: LOG-2024-000001"
          />
          <Button type="submit" loading={loading}>Buscar</Button>
        </form>

        <Alert message={error} type="error" />

        {loading && <Spinner fullPage />}

        {order && (
          <div className={styles.result}>
            <div className={styles.resultHeader}>
              <div>
                <p className={styles.resultCode}>{order.trackingCode}</p>
                <p className={styles.resultDest}>Para: <strong>{order.destinationName}</strong> — {order.destinationCity}</p>
              </div>
              <Badge status={order.status} />
            </div>

            <h2 className={styles.timelineTitle}>Historial de eventos</h2>

            {!order.trackingEvents?.length ? (
              <p className={styles.noEvents}>Sin eventos registrados aún</p>
            ) : (
              <ul className={styles.timeline}>
                {order.trackingEvents.map((ev, i) => (
                  <li key={ev.id} className={`${styles.event} ${i === 0 ? styles.latest : ''}`}>
                    <div className={styles.dot} />
                    <div className={styles.eventBody}>
                      <Badge status={ev.status} />
                      <p className={styles.eventDesc}>{ev.description}</p>
                      {ev.location && <p className={styles.eventLoc}>📍 {ev.location}</p>}
                      <p className={styles.eventDate}>
                        {new Date(ev.createdAt).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
