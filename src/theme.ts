export type ThemeId = 'retro' | 'modern';

const STORAGE_KEY = 'scorekeep:theme';

export function getSavedTheme(): ThemeId | null {
	try {
		return (localStorage.getItem(STORAGE_KEY) as ThemeId) || null;
	} catch {
		return null;
	}
}

export function getCurrentThemeAttr(): ThemeId | null {
	const attr = document.documentElement.getAttribute('data-theme');
	return (attr as ThemeId) || null;
}

export function applyTheme(id: ThemeId): void {
	document.documentElement.setAttribute('data-theme', id);
	try {
		localStorage.setItem(STORAGE_KEY, id);
	} catch {
		// ignore
	}
}

export function initTheme(defaultTheme: ThemeId = 'modern'): void {
	const saved = getSavedTheme();
	const next = saved ?? defaultTheme;
	document.documentElement.setAttribute('data-theme', next);
}


