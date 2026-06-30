import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

/**
 * useFetch — hace un GET al montar y expone { data, loading, error, refetch }
 *
 * Uso:
 *   const { data: orders, loading, error, refetch } = useFetch('/orders')
 */
export function useFetch(endpoint) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const fetchData = useCallback(async () => {
    if (!endpoint) return
    setLoading(true)
    setError('')
    try {
      const result = await api.get(endpoint)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
