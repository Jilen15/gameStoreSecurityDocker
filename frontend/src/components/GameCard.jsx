import React from 'react'
import { Link } from 'react-router-dom'

export default function GameCard({ game }) {
	const id = game.id_game ?? game.id
	const name = game.name ?? game.title ?? 'Jeu sans nom'
	const description = game.description ?? game.desc ?? 'Pas de description'
	const price = typeof game.price !== 'undefined' && game.price !== null ? Number(game.price) : null

	return (
		<div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, width: 220, background: '#fff' }}>
			<Link to={`/games/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
				<div style={{ textAlign: 'left' }}>
					<h4 style={{ margin: '0 0 6px 0', fontSize: 16 }}>{name}</h4>

					<div style={{ fontSize: 13, color: '#666' }}>{description.length > 100 ? description.slice(0, 97) + '...' : description}</div>

					<div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 12 }}>
						<div style={{ fontSize: 14, fontWeight: '600' }}>{price !== null ? `${price.toFixed(2)} €` : 'Gratuit'}</div>
					</div>
				</div>
			</Link>
		</div>
	)
}
