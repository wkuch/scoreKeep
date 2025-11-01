import type { AppState } from './types';

const STORAGE_KEY = 'scorekeep:v1';

export function loadState(): AppState | undefined {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return undefined;
		const parsed = JSON.parse(raw) as AppState;
		if (!parsed || !Array.isArray(parsed.players)) return undefined;
		return parsed;
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


