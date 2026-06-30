import styles from './Alert.module.css'

/**
 * Alert — mensajes de feedback al usuario.
 * type: 'error' | 'success' | 'warning'
 */
export default function Alert({ message, type = 'error' }) {
  if (!message) return null
  return <div className={`${styles.alert} ${styles[type]}`}>{message}</div>
}
