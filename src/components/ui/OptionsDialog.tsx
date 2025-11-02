import { useEffect, useState } from 'react';
import Modal from './Modal';
import { applyTheme, getCurrentThemeAttr, type ThemeId } from '../../theme';
import { Check } from 'lucide-react';

type OptionsDialogProps = {
	open: boolean;
	onClose: () => void;
};

const THEMES: ThemeId[] = ['retro', 'modern'];

export default function OptionsDialog({ open, onClose }: OptionsDialogProps) {
	const [theme, setTheme] = useState<ThemeId>('retro');

	useEffect(() => {
		if (!open) return;
		const current = getCurrentThemeAttr() ?? 'retro';
		setTheme(current);
	}, [open]);

	return (
		<Modal open={open} onClose={onClose} title="Options" footer={
			<button className="ml-auto btn px-4 py-2 text-sm font-semibold" onClick={onClose}>Close</button>
		}>
			<div className="space-y-4">
				<section>
					<h2 className="mb-2 text-sm font-semibold text-muted">Theme</h2>
					<div className="space-y-2">
						{THEMES.map((t) => {
							const active = theme === t;
							return (
								<button
									key={t}
									type="button"
									className={`w-full flex items-center justify-between rounded-token border px-3 py-3 text-left bg-surface ${active ? 'border-accent' : 'border-app'}`}
									onClick={() => { setTheme(t); applyTheme(t); }}
									aria-pressed={active}
								>
									<span className="capitalize text-app">{t}</span>
									{active ? <Check size={18} className="text-accent" /> : null}
								</button>
							);
						})}
					</div>
				</section>
			</div>
		</Modal>
	);
}


