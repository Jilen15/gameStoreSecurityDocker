import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({ username: '', email: '', password: '', confirm: '' })
  const navigate = useNavigate()

  function validateEmail(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value)
  }

  function validatePassword(value) {
    const len = value.length >= 12
    const upper = /[A-Z]/.test(value)
    const digit = /[0-9]/.test(value)
    const special = /[^A-Za-z0-9]/.test(value)
    return len && upper && digit && special
  }

  function handleSubmit(e) {
    e.preventDefault()

    const usernameOk = username.trim().length >= 3
    const emailOk = validateEmail(email)
    const passwordOk = validatePassword(password)
    const confirmOk = password === confirm

    setErrors({
      username: usernameOk ? '' : 'Le nom d\'utilisateur doit contenir au moins 3 caractères.',
      email: emailOk ? '' : 'Email invalide.',
      password: passwordOk ? '' : 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial.',
      confirm: confirmOk ? '' : 'Les mots de passe ne correspondent pas.',
    })

    if (!usernameOk || !emailOk || !passwordOk || !confirmOk) return

    fetch('https://localhost:3000/api/auth/register', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message || 'Échec de l\'inscription')
        }
        return res.json()
      })
      .then(() => {
        navigate('/login')
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, server: err.message }))
      })
  }

  return (
    <div style={{ maxWidth: 520, margin: '2rem auto' }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nom d'utilisateur</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            required
            placeholder="Pseudo"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
          {errors.username && <div style={{ color: 'crimson', fontSize: 13 }}>{errors.username}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="exemple@gmail.com"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
          {errors.email && <div style={{ color: 'crimson', fontSize: 13 }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Mot de passe</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Votre mot de passe"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
          {errors.password && <div style={{ color: 'crimson', fontSize: 13 }}>{errors.password}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Confirmez le mot de passe</label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            placeholder="Confirmez le mot de passe"
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
          {errors.confirm && <div style={{ color: 'crimson', fontSize: 13 }}>{errors.confirm}</div>}
        </div>

        <button type="submit">S'inscrire</button>
      </form>
      {errors.server && <div style={{ color: 'crimson', marginTop: 12 }}>{errors.server}</div>}
      <p>
        <Link to="/login">Déjà un compte ? </Link>
      </p>
    </div>
  )
}
