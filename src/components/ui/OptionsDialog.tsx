import { useEffect, useState } from 'react';
import Modal from './Modal';
import { applyTheme, getCurrentThemeAttr, type ThemeId } from '../../theme';

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
						{THEMES.map((t) => (
							<label key={t} className="flex items-center gap-2">
								<input
									type="radio"
									name="theme"
									value={t}
									checked={theme === t}
									onChange={() => {
										setTheme(t);
										applyTheme(t);
									}}
								/>
								<span className="capitalize">{t}</span>
							</label>
						))}
					</div>
				</section>
			</div>
		</Modal>
	);
}


