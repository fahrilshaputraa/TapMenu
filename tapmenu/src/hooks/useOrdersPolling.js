import { useCallback, useEffect, useState } from 'react'

import { loadOrders, updateOrderStatus } from '../services/orders'

export function useOrdersPolling() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshOrders = useCallback(async () => {
    const results = await loadOrders()
    setOrders(results)
  }, [])

  useEffect(() => {
    let active = true

    async function fetchOrders() {
      try {
        const results = await loadOrders()
        if (active) {
          setOrders(results)
          setError('')
        }
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchOrders()
    const interval = setInterval(() => {
      if (!active) return
      fetchOrders()
    }, 10000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const setOrderStatus = async (orderId, status) => {
    try {
      const updated = await updateOrderStatus(orderId, status)
      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)))
      setError('')
      return updated
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    }
  }

  return {
    error,
    loading,
    orders,
    refreshOrders,
    setOrderStatus,
  }
}
