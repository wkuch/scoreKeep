import AddPlayer from './components/AddPlayer';
import PlayerRow from './components/PlayerRow';
import { PlayersProvider, usePlayers } from './store/PlayersProvider';

function Content() {
	const { state, dispatch } = usePlayers();
	return (
		<div className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-6">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-white">Scorekeep</h1>
			</header>
			<AddPlayer />
			<div className="flex-1 space-y-3">
				{state.players.length === 0 ? (
					<div className="rounded-xl border border-dashed border-neutral-700 p-6 text-center text-neutral-400">
						Add your first player to get started
					</div>
				) : (
					state.players.map((p) => <PlayerRow key={p.id} player={p} />)
				)}
			</div>
			<footer className="sticky bottom-0 mt-auto bg-neutral-900 py-4">
				<button
					className="w-full rounded-xl bg-neutral-800 px-4 py-4 text-base font-semibold text-white ring-1 ring-neutral-700 active:scale-95"
					onClick={() => {
						if (confirm('Reset all scores to 0?')) {
							dispatch({ type: 'resetAll' });
						}
					}}
				>
					Reset All
				</button>
			</footer>
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
