import { useEffect, useRef, useState } from 'react';
import type { Player } from '../types';
import { usePlayers } from '../store/PlayersProvider';
import { MoreVertical } from 'lucide-react';

export default function PlayerRow({ player }: { player: Player }) {
	const { dispatch } = usePlayers();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (!menuOpen) return;
		function onDocClick(e: MouseEvent) {
			const target = e.target as Node;
			if (menuRef.current && !menuRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
				setMenuOpen(false);
			}
		}
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	}, [menuOpen]);

	function confirmDelete() {
		if (confirm(`Remove ${player.name}?`)) {
			dispatch({ type: 'remove', id: player.id });
		}
	}

	function resetScore() {
		if (confirm(`Reset score for ${player.name}?`)) {
			dispatch({ type: 'reset', id: player.id });
		}
	}

	function renamePlayer() {
		const result = prompt('Rename player', player.name);
		if (result == null) return;
		const trimmed = result.trim();
		if (!trimmed || trimmed === player.name) return;
		dispatch({ type: 'rename', id: player.id, name: trimmed });
	}

	return (
		<div className="relative grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl bg-neutral-800 p-3 ring-1 ring-neutral-700">
			<div className="relative">
				<button
					ref={buttonRef}
					className="h-10 w-10 grid place-items-center rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700/60 active:scale-95"
					aria-haspopup="menu"
					aria-expanded={menuOpen}
					aria-controls={`menu-${player.id}`}
					onClick={() => setMenuOpen((v) => !v)}
					title="More actions"
				>
					<MoreVertical size={20} />
				</button>
				{menuOpen && (
					<div
						ref={menuRef}
						id={`menu-${player.id}`}
						role="menu"
						className="absolute left-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 py-1 text-sm shadow-lg"
					>
						<button
							className="w-full px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								resetScore();
							}}
						>
							Reset score
						</button>
						<button
							className="w-full px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								renamePlayer();
							}}
						>
							Rename
						</button>
						<button
							className="w-full px-3 py-2 text-left text-red-400 hover:bg-neutral-800 hover:text-red-300"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								confirmDelete();
							}}
						>
							Delete
						</button>
					</div>
				)}
			</div>
			<div className="min-w-0">
				<div className="truncate text-base font-semibold text-white">{player.name}</div>
				<div className="text-sm text-neutral-400">Score</div>
			</div>
			<div className="w-16 text-right text-2xl font-bold tabular-nums text-white">{player.score}</div>
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


