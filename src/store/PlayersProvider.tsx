import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { AppState, Player } from '../types';
import { loadState, saveState } from '../storage';

type Action =
	| { type: 'add'; name: string }
	| { type: 'inc'; id: string }
	| { type: 'dec'; id: string }
	| { type: 'resetAll' };

type PlayersContextValue = {
	state: AppState;
	dispatch: React.Dispatch<Action>;
};

const PlayersContext = createContext<PlayersContextValue | undefined>(undefined);

function createInitialState(): AppState {
	const fromStorage = loadState();
	return fromStorage ?? { players: [] };
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
			};
			return { ...state, players: [...state.players, player] };
		}
		case 'inc': {
			return {
				...state,
				players: state.players.map((p) => (p.id === action.id ? { ...p, score: p.score + 1 } : p)),
			};
		}
		case 'dec': {
			return {
				...state,
				players: state.players.map((p) => (p.id === action.id ? { ...p, score: p.score - 1 } : p)),
			};
		}
		case 'resetAll': {
			return { ...state, players: state.players.map((p) => ({ ...p, score: 0 })) };
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


