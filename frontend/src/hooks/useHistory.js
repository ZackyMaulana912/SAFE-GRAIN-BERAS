import { useState, useCallback, useEffect } from 'react'
import { fetchHistory, clearHistory as apiClear } from '../utils/api'

export function useHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchHistory()
      setHistory(data.items || [])
    } catch {
      setHistory([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(async () => {
    await apiClear()
    setHistory([])
  }, [])

  const addItem = useCallback((item) => {
    setHistory(prev => [item, ...prev].slice(0, 50))
  }, [])

  useEffect(() => { load() }, [load])

  return { history, loading, load, clear, addItem }
}
