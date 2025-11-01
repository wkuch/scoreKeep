import type { Player } from '../types';
import { usePlayers } from '../store/PlayersProvider';

export default function PlayerRow({ player }: { player: Player }) {
	const { dispatch } = usePlayers();
	return (
		<div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl bg-neutral-800 p-3 ring-1 ring-neutral-700">
			<div className="min-w-0">
				<div className="truncate text-base font-semibold text-white">{player.name}</div>
				<div className="text-sm text-neutral-400">Score</div>
			</div>
			<div className="text-right text-2xl font-bold tabular-nums text-white w-16">{player.score}</div>
			<div className="flex gap-2">
				<button
					className="h-12 w-12 rounded-lg bg-neutral-900 text-2xl font-bold text-white ring-1 ring-neutral-700 active:scale-95"
					onClick={() => dispatch({ type: 'dec', id: player.id })}
				>
					-
				</button>
				<button
					className="h-12 w-12 rounded-lg bg-indigo-600 text-2xl font-bold text-white active:scale-95"
					onClick={() => dispatch({ type: 'inc', id: player.id })}
				>
					+
				</button>
			</div>
		</div>
	);
}


