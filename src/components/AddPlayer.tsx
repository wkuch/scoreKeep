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
				className="flex-1 rounded-lg bg-neutral-800 px-3 py-3 text-base placeholder-neutral-400 outline-none ring-1 ring-neutral-700 focus:ring-indigo-500"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') submit();
				}}
			/>
			<button
				className="rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white active:scale-95"
				onClick={submit}
			>
				Add
			</button>
		</div>
	);
}


