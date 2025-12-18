import React, { useEffect, useState } from 'react'
import GameCard from '../components/GameCard'
import SearchBar from '../components/SearchBar'

export default function Home() {
	const [games, setGames] = useState([])
	const [query, setQuery] = useState('')

	useEffect(() => {
		fetch('https://localhost:3000/api/games', {
            credentials: 'include',
        })
			.then((res) => {
				if (!res.ok) throw new Error('network')
				return res.json()
			})
			.then((data) => setGames(data))
			.catch((err) => {
				console.error('Failed to load games:', err)
				setGames([])
			})
	}, [])

	const filtered = games.filter((g) =>
		g.title.toLowerCase().includes(query.trim().toLowerCase()),
	)

	return (
		<div>
			<h1>Page d'accueil</h1>
			<SearchBar value={query} onChange={(v) => setQuery(v)} />

			{filtered.length > 0 ? (
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 220px)', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
					{filtered.map((game) => (
						<GameCard key={game.id_game ?? game.id} game={game} />
					))}
				</div>
			) : (
				<div style={{ marginTop: 20, color: '#666' }}>Aucun jeu trouvé.</div>
			)}
		</div>
	)
}
