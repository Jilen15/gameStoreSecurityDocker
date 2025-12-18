import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
	return (
		<header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
			<div>
				<Link to="/" style={{ fontWeight: 'bold', fontSize: 18 }}>GameStore</Link>
			</div>

			<nav style={{ display: 'flex', gap: 12 }}>
				<Link to="/">Accueil</Link>
			</nav>
		</header>
	)
}
