import { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { api }      from '@/lib/api'
import Badge        from '@/components/ui/Badge'
import Button       from '@/components/ui/Button'
import Alert        from '@/components/ui/Alert'
import Spinner      from '@/components/ui/Spinner'
import CitySelect   from '@/components/ui/CitySelect'
import styles       from './Admin.module.css'

export default function Admin() {
  const { data: users,  loading: loadU, error: errU, refetch: refetchUsers }   = useFetch('/users')
  const { data: orders, loading: loadO, error: errO, refetch: refetchOrders }  = useFetch('/orders')
  const [tab,           setTab]           = useState('users')
  const [actionErr,     setActionErr]     = useState('')
  const [draftStatuses, setDraftStatuses] = useState({})
  const [locations,     setLocations]     = useState({})

  const loading = loadU || loadO
  if (loading) return <Spinner fullPage />

  function setDraftStatus(orderId, status) {
    setDraftStatuses(prev => ({ ...prev, [orderId]: status }))
  }

  function setLocation(orderId, city) {
    setLocations(prev => ({ ...prev, [orderId]: city }))
  }

  async function handleDeleteUser(id) {
    if (!confirm('¿Eliminar este usuario?')) return
    try { await api.delete(`/users/${id}`); refetchUsers() }
    catch (err) { setActionErr(err.message) }
  }

  async function handleDeleteOrder(id) {
    if (!confirm('¿Eliminar este pedido?')) return
    try { await api.delete(`/orders/${id}`); refetchOrders() }
    catch (err) { setActionErr(err.message) }
  }

  async function handleAccept(orderId) {
    const order = orders?.find(o => o.id === orderId)
    if (!order) return
    const status = draftStatuses[orderId] || order.status
    const location = locations[orderId] || undefined
    if (!draftStatuses[orderId] && !location) {
      setActionErr('Cambiá el estado o seleccioná una ciudad antes de aceptar')
      return
    }
    try {
      await api.patch(`/orders/${orderId}`, { status, location })
      setDraftStatuses(prev => { const copy = { ...prev }; delete copy[orderId]; return copy })
      setLocations(prev => { const copy = { ...prev }; delete copy[orderId]; return copy })
      refetchOrders()
    }
    catch (err) { setActionErr(err.message) }
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>Panel de administración</h1>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{users?.length ?? 0}</span>
            <span className={styles.statLabel}>Usuarios</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{orders?.length ?? 0}</span>
            <span className={styles.statLabel}>Pedidos</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {orders?.filter(o => o.status === 'in_transit').length ?? 0}
            </span>
            <span className={styles.statLabel}>En tránsito</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {orders?.filter(o => o.status === 'delivered').length ?? 0}
            </span>
            <span className={styles.statLabel}>Entregados</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'users'  ? styles.active : ''}`} onClick={() => setTab('users')}>Usuarios</button>
          <button className={`${styles.tab} ${tab === 'orders' ? styles.active : ''}`} onClick={() => setTab('orders')}>Pedidos</button>
        </div>

        <Alert message={actionErr || errU || errO} type="error" />

        {tab === 'users' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map(u => (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td><span className={styles.roleBadge}>{u.role}</span></td>
                    <td>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteUser(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th><th>Destino</th><th>Estado</th><th>Cambiar estado</th><th>Acción</th>
                </tr>
              </thead>
              <tbody>
                  {(orders || []).map(o => (
                    <tr key={o.id}>
                      <td><code>{o.trackingCode}</code></td>
                      <td>{o.destinationName}</td>
                      <td><Badge status={o.status} /></td>
                      <td>
                        <div className={styles.statusCell}>
                          <select
                            className={styles.select}
                            value={draftStatuses[o.id] || o.status}
                            onChange={e => setDraftStatus(o.id, e.target.value)}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="in_transit">En tránsito</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                          <CitySelect
                            value={locations[o.id] || ''}
                            onChange={city => setLocation(o.id, city)}
                            placeholder="Ciudad..."
                          />
                          <button className={styles.acceptBtn} onClick={() => handleAccept(o.id)}>
                            Aceptar
                          </button>
                        </div>
                      </td>
                      <td>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteOrder(o.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
