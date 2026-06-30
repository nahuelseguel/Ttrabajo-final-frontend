import { Link } from 'react-router-dom'
import { useUser } from '@/context/UserContext'
import styles from './Home.module.css'

export default function Home() {
  const { isLoggedIn } = useUser()

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Seguí tus pedidos<br />
          <span className={styles.accent}>en tiempo real</span>
        </h1>
        <p className={styles.subtitle}>
          Plataforma de logística y trazabilidad. Creá, gestioná y rastreá
          tus envíos desde un solo lugar.
        </p>
        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <Link to="/orders"   className={styles.btnPrimary}>Ver mis pedidos</Link>
              <Link to="/tracking" className={styles.btnSecondary}>Rastrear envío</Link>
            </>
          ) : (
            <>
              <Link to="/register" className={styles.btnPrimary}>Empezar gratis</Link>
              <Link to="/login"    className={styles.btnSecondary}>Ya tengo cuenta</Link>
            </>
          )}
        </div>
      </section>

      <section className={styles.features}>
        {[
          { icon: '📍', title: 'Trazabilidad completa',   desc: 'Seguí cada movimiento de tu paquete con eventos en tiempo real.' },
          { icon: '🔐', title: 'Datos seguros',           desc: 'Tu información sensible va siempre cifrada.' },
          { icon: '⚡', title: 'Actualizaciones al instante', desc: 'Operadores cargan novedades y vos las ves al momento.' },
        ].map(f => (
          <div key={f.title} className={styles.card}>
            <span className={styles.icon}>{f.icon}</span>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p  className={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
