import { useEffect, useState } from 'react'

import {
  clearCashierSession,
  getStoredAuth,
  hasUnlockedCashierSession,
  loginCashier,
  setCashierSessionUnlocked,
} from '../services/auth'

export function useCashierSession() {
  const [authUser, setAuthUser] = useState(() => getStoredAuth()?.user || null)
  const userRole = Number(authUser?.role)
  const requiresCashierUnlock = userRole === 3
  const [isPosOpen, setIsPosOpen] = useState(() => !requiresCashierUnlock || hasUnlockedCashierSession(authUser?.id))
  const [pin, setPin] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isUnlockSubmitting, setIsUnlockSubmitting] = useState(false)

  const cashierId = authUser?.employee_code || ''

  useEffect(() => {
    setIsPosOpen(!requiresCashierUnlock || hasUnlockedCashierSession(authUser?.id))
  }, [authUser?.id, requiresCashierUnlock])

  const enterPos = async () => {
    if (!requiresCashierUnlock) {
      setIsPosOpen(true)
      return true
    }

    if (!cashierId) {
      setLoginError('Akun kasir tidak memiliki employee code.')
      return false
    }

    setIsUnlockSubmitting(true)
    setLoginError('')

    try {
      const payload = await loginCashier(cashierId, pin)
      setAuthUser(payload.user)
      setCashierSessionUnlocked(payload.user?.id)
      setIsPosOpen(true)
      setPin('')
      return true
    } catch (error) {
      setLoginError(error.message || 'PIN kasir tidak valid.')
      return false
    } finally {
      setIsUnlockSubmitting(false)
    }
  }

  const lockCashier = () => {
    clearCashierSession()
    setIsPosOpen(false)
    setPin('')
    setLoginError('')
  }

  return {
    authUser,
    cashierId,
    enterPos,
    isPosOpen,
    isUnlockSubmitting,
    lockCashier,
    loginError,
    pin,
    requiresCashierUnlock,
    setPin,
  }
}
