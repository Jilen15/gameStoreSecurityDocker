import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Profiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    fetch('https://localhost:3000/api/profiles', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || 'Erreur lors du chargement des profils')
        }
        return res.json()
      })
      .then(async (data) => {
        if (!mounted) return

        const enriched = await Promise.all(
          data.map(async (p) => {
            try {
              const r = await fetch(`https://localhost:3000/api/users/${p.userId}`, { credentials: 'include' })
              if (!r.ok) return { profile: p, user: { id: p.userId } }
              const body = await r.json().catch(() => ({}))
              return { profile: p, user: body.user ?? { id: p.userId } }
            } catch (e) {
              return { profile: p, user: { id: p.userId } }
            }
          }),
        )

        setProfiles(enriched)
      })
      .catch((err) => {
        console.error('Failed to load profiles:', err)
        setError(err.message || 'Erreur réseau')
      })
      .finally(() => setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Chargement des profils...</div>
  if (error) return <div style={{ color: 'crimson' }}>{error}</div>

  return (
    <div>
      <h1>Mon Profil</h1>

      {profiles.length === 0 && <div style={{ color: '#666' }}>Aucun profil trouvé.</div>}

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {profiles.map(({ profile, user }) => (
          <div key={profile.userId} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{user.username ?? `Utilisateur ${profile.userId}`}</strong>
                <div style={{ fontSize: 13, color: '#666' }}>{user.email ?? ''}</div>
              </div>
            </div>

            {Array.isArray(profile.gamesList) && profile.gamesList.length > 0 ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Jeux:</div>
                <ul style={{ margin: 6 }}>
                  {profile.gamesList.map((g, i) => (
                    <li key={i} style={{ fontSize: 13 }}>{g.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ marginTop: 8, color: '#666' }}>Aucun jeu dans la liste.</div>
            )}

            {Array.isArray(profile.commentHistory) && profile.commentHistory.length > 0 ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Commentaires:</div>
                <ul style={{ margin: 6 }}>
                  {profile.commentHistory.map((c, i) => (
                    <li key={i} style={{ fontSize: 13 }}>
                      <strong>Jeu #{c.gameId}</strong> — {c.note}/10 — {c.content}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
