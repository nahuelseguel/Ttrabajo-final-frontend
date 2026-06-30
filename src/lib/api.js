/**
 * lib/api.js
 * Capa de comunicación con el backend.
 * Todas las peticiones pasan por aquí — los componentes nunca usan fetch directamente.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// ─── Token helpers ────────────────────────────────────────────────────────────

function getToken() {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    null
  )
}

// ─── Fetcher base ─────────────────────────────────────────────────────────────

async function request(method, endpoint, body = null) {
  const token = getToken()

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const config = { method, headers }
  if (body) config.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  // 204 No Content — no hay body
  if (response.status === 204) return null

  const data = await response.json()

  if (!response.ok) {
    // El backend siempre devuelve { message } en errores
    const message =
      Array.isArray(data.message) ? data.message.join(', ') : data.message
    throw new Error(message || 'Error inesperado')
  }

  // El backend envuelve en { success, data } gracias al TransformInterceptor
  return data.data ?? data
}

// ─── Métodos públicos ─────────────────────────────────────────────────────────

export const api = {
  get:    (endpoint)        => request('GET',    endpoint),
  post:   (endpoint, body)  => request('POST',   endpoint, body),
  patch:  (endpoint, body)  => request('PATCH',  endpoint, body),
  delete: (endpoint)        => request('DELETE', endpoint),
}
