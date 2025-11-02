import type { AppState, Player } from './types';

const STORAGE_KEY = 'scorekeep:v1';

export function loadState(): AppState | undefined {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return undefined;
		const parsed = JSON.parse(raw) as Partial<AppState>;
		if (!parsed || !Array.isArray(parsed.players)) return undefined;
		const players: Player[] = parsed.players.map((p: any) => ({
			id: p.id,
			name: p.name,
			score: typeof p.score === 'number' ? p.score : 0,
			createdAt: typeof p.createdAt === 'number' ? p.createdAt : Date.now(),
			pendingDelta: typeof p.pendingDelta === 'number' ? p.pendingDelta : 0,
			revealed: Boolean(p.revealed),
		}));
		return { players, hideTotals: Boolean((parsed as any).hideTotals) };
	} catch {
		return undefined;
	}
}

export function saveState(state: AppState): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// ignore write errors
	}
}


