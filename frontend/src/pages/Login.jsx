import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState({ email: '', password: '' })
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
		const emailOk = validateEmail(email)
		const passOk = validatePassword(password)
		setErrors({
			email: emailOk ? '' : 'L\'email doit être une adresse email valide (ex: exemple@domaine.com).',
			password: passOk ? '' : 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial.'
		})
		if (!emailOk || !passOk) return

		fetch('https://localhost:3000/api/auth/login', {
            credentials: 'include',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})
			.then(async (res) => {
				if (!res.ok) {
					const body = await res.json().catch(() => ({}))
					throw new Error(body.message || 'Échec de la connexion')
				}
				return res.json()
			})
			.then((data) => {
				if (data.token) {
					localStorage.setItem('token', data.token)
				}
				navigate('/profile')
			})
			.catch((err) => {
				setErrors((prev) => ({ ...prev, server: err.message }))
			})
	}

	return (
		<div style={{ maxWidth: 420, margin: '2rem auto' }}>
			<h2>Connexion</h2>
			<form onSubmit={handleSubmit}>
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

				<button type="submit">Connexion</button>
			</form>
			{errors.server && <div style={{ color: 'crimson', marginTop: 12 }}>{errors.server}</div>}
			<p>
				<Link to="/register">Créer un compte?</Link>
			</p>
		</div>
	)
}
