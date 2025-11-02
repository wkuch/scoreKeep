import { useState } from 'react';
import AddPlayer from './components/AddPlayer';
import PlayerRow from './components/PlayerRow';
import { PlayersProvider, usePlayers } from './store/PlayersProvider';
import ConfirmDialog from './components/ui/ConfirmDialog';
import OptionsDialog from './components/ui/OptionsDialog';
import { Settings } from 'lucide-react';

function Content() {
	const { state, dispatch } = usePlayers();
	const [showResetAll, setShowResetAll] = useState(false);
	const [showRevealAll, setShowRevealAll] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	return (
		<div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-6">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Scorekeep</h1>
				<button
					className="btn px-3 py-2 active:scale-95"
					onClick={() => setShowOptions(true)}
					aria-label="Open options"
				>
					<Settings size={18} />
				</button>
			</header>
			<AddPlayer />
			<div className="flex-1 space-y-3">
				{state.players.length === 0 ? (
					<div className="rounded-token border border-dashed border-app p-6 text-center text-muted">
						Add your first player to get started
					</div>
				) : (
					state.players.map((p) => <PlayerRow key={p.id} player={p} />)
				)}
			</div>
			<footer className="sticky bottom-0 mt-auto space-y-3 py-4">
				<button
					className="btn w-full px-4 py-4 text-base font-semibold active:scale-95"
					onClick={() => {
						if (state.hideTotals) {
							setShowRevealAll(true);
						} else {
							dispatch({ type: 'toggleHideTotals' });
						}
					}}
				>
					{state.hideTotals ? 'Show total score' : 'Hide total score'}
				</button>
				<button
					className="btn w-full px-4 py-4 text-base font-semibold active:scale-95"
					onClick={() => setShowResetAll(true)}
				>
					Reset All
				</button>
			</footer>
			<ConfirmDialog
				open={showResetAll}
				title="Reset all scores"
				description="Reset every player's score to 0?"
				confirmText="Reset"
				onConfirm={() => dispatch({ type: 'resetAll' })}
				onClose={() => setShowResetAll(false)}
			/>
			<ConfirmDialog
				open={showRevealAll}
				title="Reveal all scores"
				description="Show every player's total score?"
				confirmText="Reveal"
				onConfirm={() => dispatch({ type: 'toggleHideTotals' })}
				onClose={() => setShowRevealAll(false)}
			/>
			<OptionsDialog open={showOptions} onClose={() => setShowOptions(false)} />
		</div>
	);
}

export default function App() {
	return (
		<PlayersProvider>
			<Content />
		</PlayersProvider>
	);
}
