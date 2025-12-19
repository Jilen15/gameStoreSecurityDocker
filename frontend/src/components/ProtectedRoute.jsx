import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'unauth'

  useEffect(() => {
    let mounted = true

    async function check() {
      try {
        const res = await fetch('https://localhost:3000/api/auth/me', { credentials: 'include' })
        if (!mounted) return
        if (res.ok) {
          setStatus('ok')
        } else {
          setStatus('unauth')
        }
      } catch (e) {
        // network / CORS / server not exposing endpoint => treat as unauth
        if (!mounted) return
        setStatus('unauth')
      }
    }

    check()

    return () => { mounted = false }
  }, [])

  if (status === 'loading') return <div>Vérification...</div>
  if (status === 'unauth') return <Navigate to="/login" replace />
  return children
}
