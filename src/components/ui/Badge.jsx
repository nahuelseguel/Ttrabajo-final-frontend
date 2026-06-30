import styles from './Badge.module.css'

const LABELS = {
  pending:          'Pendiente',
  confirmed:        'Confirmado',
  in_transit:       'En tránsito',
  delivered:        'Entregado',
  cancelled:        'Cancelado',
}

export default function Badge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[status] || styles.pending}`}>
      {LABELS[status] || status}
    </span>
  )
}
