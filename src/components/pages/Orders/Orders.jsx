import { useState } from 'react'
import { useFetch }   from '@/hooks/useFetch'
import { api }        from '@/lib/api'
import Badge          from '@/components/ui/Badge'
import Button         from '@/components/ui/Button'
import Spinner        from '@/components/ui/Spinner'
import Alert          from '@/components/ui/Alert'
import OrderForm      from './OrderForm'
import styles         from './Orders.module.css'

export default function Orders() {
  const { data: orders, loading, error, refetch } = useFetch('/orders')
  const [showForm,   setShowForm]   = useState(false)
  const [editing,    setEditing]    = useState(null)   // pedido a editar
  const [actionError, setActionError] = useState('')

  async function handleDelete(id) {
    if (!confirm('¿Eliminár este pedido?')) return
    try {
      await api.delete(`/orders/${id}`)
      refetch()
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function handleSave(formData) {
    try {
      if (editing) {
        await api.patch(`/orders/${editing.id}`, formData)
      } else {
        await api.post('/orders', formData)
      }
      setShowForm(false)
      setEditing(null)
      refetch()
    } catch (err) {
      throw err // el form lo muestra
    }
  }

  function handleEdit(order) {
    setEditing(order)
    setShowForm(true)
  }

  if (loading) return <Spinner fullPage />

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>Mis pedidos</h1>
          <Button onClick={() => { setEditing(null); setShowForm(true) }}>
            + Nuevo pedido
          </Button>
        </div>

        <Alert message={error || actionError} type="error" />

        {showForm && (
          <OrderForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        )}

        {!orders?.length ? (
          <div className={styles.empty}>
            <p>No hay pedidos aún. ¡Creá el primero!</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Destino</th>
                  <th>Ciudad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td><code className={styles.code}>{order.trackingCode}</code></td>
                    <td>{order.destinationName}</td>
                    <td>{order.destinationCity}</td>
                    <td><Badge status={order.status} /></td>
                    <td>{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className={styles.actions}>
                      <button className={styles.editBtn}  onClick={() => handleEdit(order)}>Editar</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(order.id)}>Eliminar</button>
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
