import { useState } from 'react';
import { usePlayers } from '../store/PlayersProvider';

export default function AddPlayer() {
	const { dispatch } = usePlayers();
	const [name, setName] = useState('');

	function submit() {
		const trimmed = name.trim();
		if (!trimmed) return;
		dispatch({ type: 'add', name: trimmed });
		setName('');
	}

	return (
		<div className="flex gap-2">
			<input
				type="text"
				inputMode="text"
				placeholder="Add player"
				className="input flex-1 px-3 py-3 text-base outline-none"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') submit();
				}}
			/>
			<button
				className="btn px-4 py-3 text-base font-semibold active:scale-95"
				onClick={submit}
			>
				Add
			</button>
		</div>
	);
}


