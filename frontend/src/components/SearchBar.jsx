import React from 'react'

export default function SearchBar({ value = '', onChange = () => {} }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
			<input
				placeholder="Recherche..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				style={{ padding: '8px 12px', width: 320, borderRadius: 6, border: '1px solid #ccc' }}
			/>
			<button onClick={() => onChange('')} style={{ padding: '8px 12px' }}>Réinitialiser</button>
		</div>
	)
}
