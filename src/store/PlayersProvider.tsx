import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { AppState, Player } from '../types';
import { loadState, saveState } from '../storage';

type Action =
	| { type: 'add'; name: string }
	| { type: 'inc'; id: string }
	| { type: 'dec'; id: string }
	| { type: 'addAmount'; id: string; amount: number }
	| { type: 'remove'; id: string }
	| { type: 'reset'; id: string }
	| { type: 'rename'; id: string; name: string }
	| { type: 'resetAll' }
	| { type: 'applyPending'; id: string }
	| { type: 'toggleHideTotals' }
	| { type: 'revealOne'; id: string }
	| { type: 'hideOne'; id: string };

type PlayersContextValue = {
	state: AppState;
	dispatch: React.Dispatch<Action>;
};

const PlayersContext = createContext<PlayersContextValue | undefined>(undefined);

function createInitialState(): AppState {
	const fromStorage = loadState();
	return fromStorage ?? { players: [], hideTotals: false };
}

function addToPlayer(state: AppState, id: string, amount: number): AppState {
	if (state.hideTotals) {
		return {
			...state,
			players: state.players.map((p) =>
				p.id === id ? { ...p, pendingDelta: (p.pendingDelta ?? 0) + amount } : p
			),
		};
	}
	return {
		...state,
		players: state.players.map((p) => (p.id === id ? { ...p, score: p.score + amount } : p)),
	};
}

function playersReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case 'add': {
			const trimmed = action.name.trim();
			if (trimmed.length === 0) return state;
			const player: Player = {
				id: crypto.randomUUID(),
				name: trimmed,
				score: 0,
				createdAt: Date.now(),
				pendingDelta: 0,
			};
			return { ...state, players: [...state.players, player] };
		}
		case 'inc': {
			return addToPlayer(state, action.id, 1);
		}
		case 'dec': {
			return addToPlayer(state, action.id, -1);
		}
		case 'addAmount': {
			return addToPlayer(state, action.id, action.amount);
		}
		case 'resetAll': {
			return { ...state, players: state.players.map((p) => ({ ...p, score: 0, pendingDelta: 0 })) };
		}
		case 'remove': {
			return { ...state, players: state.players.filter((p) => p.id !== action.id) };
		}
		case 'reset': {
			return {
				...state,
				players: state.players.map((p) => (p.id === action.id ? { ...p, score: 0, pendingDelta: 0 } : p)),
			};
		}
		case 'rename': {
			const newName = action.name.trim();
			if (!newName) return state;
			return {
				...state,
				players: state.players.map((p) => (p.id === action.id ? { ...p, name: newName } : p)),
			};
		}
		case 'applyPending': {
			return {
				...state,
				players: state.players.map((p) =>
					p.id === action.id
						? { ...p, score: p.score + (p.pendingDelta ?? 0), pendingDelta: 0 }
						: p
					),
			};
		}
		case 'toggleHideTotals': {
			const next = !state.hideTotals;
			return {
				...state,
				hideTotals: next,
				players: state.players.map((p) => ({ ...p, revealed: false })),
			};
		}
		case 'revealOne': {
			return {
				...state,
				players: state.players.map((p) => (p.id === action.id ? { ...p, revealed: true } : p)),
			};
		}
		case 'hideOne': {
			return {
				...state,
				players: state.players.map((p) => (p.id === action.id ? { ...p, revealed: false } : p)),
			};
		}
		default:
			return state;
	}
}

export function PlayersProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(playersReducer, undefined, createInitialState);

	useEffect(() => {
		saveState(state);
	}, [state]);

	const value = useMemo(() => ({ state, dispatch }), [state]);

	return <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>;
}

export function usePlayers() {
	const ctx = useContext(PlayersContext);
	if (!ctx) throw new Error('usePlayers must be used within PlayersProvider');
	return ctx;
}


