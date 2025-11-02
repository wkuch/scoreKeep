import { useEffect, useRef, useState } from 'react';
import type { Player } from '../types';
import { usePlayers } from '../store/PlayersProvider';
import { MoreVertical, Eye } from 'lucide-react';
import ConfirmDialog from './ui/ConfirmDialog';
import PromptDialog from './ui/PromptDialog';

export default function PlayerRow({ player }: { player: Player }) {
	const { dispatch, state } = usePlayers();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [showDelete, setShowDelete] = useState(false);
	const [showReset, setShowReset] = useState(false);
	const [showRename, setShowRename] = useState(false);
	const [showReveal, setShowReveal] = useState(false);

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

	function handleRename(value: string) {
		if (!value || value === player.name) return;
		dispatch({ type: 'rename', id: player.id, name: value });
	}

const pending = player.pendingDelta ?? 0;
const hide = state.hideTotals;
const isRevealed = Boolean(player.revealed);

	return (
		<div className="relative grid grid-cols-[auto_1fr_6ch_auto] items-center gap-3 card p-3">
			<div className="relative">
				<button
					ref={buttonRef}
					className="h-10 w-10 grid place-items-center rounded-token text-muted hover:text-app active:scale-95"
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
						className="absolute left-0 z-20 mt-2 w-40 overflow-hidden rounded-token border border-app bg-surface py-1 text-sm shadow-lg"
					>
						<button
							className="w-full px-3 py-2 text-left text-app hover:bg-surface"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								setShowReset(true);
							}}
						>
							Reset score
						</button>
						<button
							className="w-full px-3 py-2 text-left text-app hover:bg-surface"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								setShowRename(true);
							}}
						>
							Rename
						</button>
						<button
							className="w-full px-3 py-2 text-left text-red-400 hover:bg-surface hover:text-red-300"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								setShowDelete(true);
							}}
						>
							Delete
						</button>
					</div>
				)}
			</div>
			<ConfirmDialog
				open={showDelete}
				title="Delete player"
				description={`Are you sure you want to delete ${player.name}?`}
				confirmText="Delete"
				onConfirm={() => dispatch({ type: 'remove', id: player.id })}
				onClose={() => setShowDelete(false)}
			/>
			<ConfirmDialog
				open={showReset}
				title="Reset score"
				description={`Reset ${player.name}'s score to 0?`}
				confirmText="Reset"
				onConfirm={() => dispatch({ type: 'reset', id: player.id })}
				onClose={() => setShowReset(false)}
			/>
		<ConfirmDialog
				open={showReveal}
				title="Reveal total score"
			description="Reveal this player's score?"
				confirmText="Reveal"
			onConfirm={() => dispatch({ type: 'revealOne', id: player.id })}
				onClose={() => setShowReveal(false)}
			/>
			<PromptDialog
				open={showRename}
				title="Rename player"
				label="Name"
				initialValue={player.name}
				confirmText="Save"
				onConfirm={handleRename}
				onClose={() => setShowRename(false)}
			/>
		<div className="min-w-0 pr-2">
			<div className="truncate text-base font-semibold text-app">{player.name}</div>
			{hide && pending !== 0 && (
				<div className="mt-1 text-sm text-muted">
					<span className={pending > 0 ? 'text-green-400' : 'text-red-400'}>
						{pending > 0 ? `+${pending}` : pending}
					</span>
				</div>
			)}
		</div>
		<div className="justify-self-end text-right text-2xl font-bold tabular-nums text-app w-[6ch]">
			{hide && !isRevealed ? (
				<button
					className="inline-grid place-items-center text-muted hover:text-app"
					onClick={() => {
						setShowReset(false);
						setShowRename(false);
						setShowDelete(false);
						setMenuOpen(false);
						setShowReveal(true);
					}}
					title="Reveal total score"
				>
					<Eye size={22} />
				</button>
			) : (
				<span
					className={hide ? 'cursor-pointer hover:text-app' : undefined}
					onClick={() => {
						if (hide) dispatch({ type: 'hideOne', id: player.id });
					}}
				>
					{player.score}
				</span>
			)}
		</div>
			<div className="flex items-center gap-2 ml-4">
				<button className="btn grid place-items-center h-12 w-12 text-2xl leading-none font-bold active:scale-95" onClick={() => dispatch({ type: 'dec', id: player.id })}>-</button>
				<button className="btn grid place-items-center h-12 w-12 text-2xl leading-none font-bold active:scale-95" onClick={() => dispatch({ type: 'inc', id: player.id })}>+</button>
				{hide ? (
					<button
						className={`grid place-items-center h-12 w-12 text-sm font-semibold active:scale-95 ` + (pending !== 0 ? 'btn' : 'opacity-0 pointer-events-none')}
						onClick={() => pending !== 0 && dispatch({ type: 'applyPending', id: player.id })}
						title="Apply pending"
						aria-hidden={pending === 0}
					>
						{pending > 0 ? `+${pending}` : pending}
					</button>
				) : (
					<button className="h-12 w-12 opacity-0 pointer-events-none" aria-hidden="true">+0</button>
				)}
			</div>
		</div>
	);
}


