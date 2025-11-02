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
		<div className="relative grid grid-cols-[auto_1fr_6ch_auto] items-center gap-3 rounded-xl bg-neutral-800 p-3 ring-1 ring-neutral-700">
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
								setShowReset(true);
							}}
						>
							Reset score
						</button>
						<button
							className="w-full px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800"
							role="menuitem"
							onClick={() => {
								setMenuOpen(false);
								setShowRename(true);
							}}
						>
							Rename
						</button>
						<button
							className="w-full px-3 py-2 text-left text-red-400 hover:bg-neutral-800 hover:text-red-300"
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
			<div className="truncate text-base font-semibold text-white">{player.name}</div>
			{hide && pending !== 0 && (
				<div className="mt-1 text-sm text-neutral-400">
					<span className={pending > 0 ? 'text-green-400' : 'text-red-400'}>
						{pending > 0 ? `+${pending}` : pending}
					</span>
				</div>
			)}
		</div>
		<div className="justify-self-end text-right text-2xl font-bold tabular-nums text-white w-[6ch]">
			{hide && !isRevealed ? (
				<button
					className="inline-grid place-items-center text-neutral-400 hover:text-white"
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
					className={hide ? 'cursor-pointer hover:text-neutral-300' : undefined}
					onClick={() => {
						if (hide) dispatch({ type: 'hideOne', id: player.id });
					}}
				>
					{player.score}
				</span>
			)}
		</div>
			<div className="flex items-center gap-2 ml-4">
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
				{hide ? (
					<button
						className={
							`h-12 w-12 rounded-lg text-sm font-semibold active:scale-95 ` +
							(pending !== 0
								? 'bg-neutral-800 text-white ring-1 ring-neutral-700'
								: 'opacity-0 pointer-events-none bg-transparent')
						}
						onClick={() => pending !== 0 && dispatch({ type: 'applyPending', id: player.id })}
						title="Apply pending"
						aria-hidden={pending === 0}
					>
						{pending > 0 ? `+${pending}` : pending}
					</button>
				) : (
					<button className="h-12 w-12 rounded-lg opacity-0 pointer-events-none" aria-hidden="true">+0</button>
				)}
			</div>
		</div>
	);
}


