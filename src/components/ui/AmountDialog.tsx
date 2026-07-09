import { useEffect, useState } from 'react';
import Modal from './Modal';

const QUICK_AMOUNTS = [5, 10, 20, 50];

type AmountDialogProps = {
	open: boolean;
	sign: 1 | -1;
	playerName: string;
	onConfirm: (amount: number) => void;
	onClose: () => void;
};

export default function AmountDialog({ open, sign, playerName, onConfirm, onClose }: AmountDialogProps) {
	const [value, setValue] = useState('');
	const [interactive, setInteractive] = useState(false);

	useEffect(() => {
		if (!open) return;
		setValue('');
		// Releasing the long-press that opened this dialog can land a synthesized
		// click on whatever is under the finger (iOS); keep the dialog inert until
		// that click has passed.
		setInteractive(false);
		const t = window.setTimeout(() => setInteractive(true), 400);
		return () => window.clearTimeout(t);
	}, [open]);

	function confirm(amount: number) {
		onConfirm(sign * amount);
		onClose();
	}

	function submitInput() {
		const amount = Number.parseInt(value, 10);
		if (!Number.isFinite(amount) || amount <= 0) return;
		confirm(amount);
	}

	const verb = sign > 0 ? 'Add' : 'Subtract';

	return (
		<div className={interactive ? 'contents' : 'contents pointer-events-none'}>
			<Modal
				open={open}
				onClose={onClose}
				title={`${verb} points — ${playerName}`}
				footer={
					<>
						<button className="btn flex-1 px-4 py-3" onClick={onClose}>
							Cancel
						</button>
						<button className="btn flex-1 px-4 py-3 font-semibold" onClick={submitInput}>
							{verb}
						</button>
					</>
				}
			>
				<div className="space-y-4">
					<div className="grid grid-cols-4 gap-2">
						{QUICK_AMOUNTS.map((n) => (
							<button
								key={n}
								className="btn px-2 py-3 text-base font-semibold active:scale-95"
								onClick={() => confirm(n)}
							>
								{sign > 0 ? '+' : '-'}
								{n}
							</button>
						))}
					</div>
					<div className="space-y-2">
						<label className="block text-sm text-muted" htmlFor="amount-input">
							Custom amount
						</label>
						<input
							id="amount-input"
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							placeholder="e.g. 37"
							value={value}
							onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
							onKeyDown={(e) => {
								if (e.key === 'Enter') submitInput();
							}}
							className="input w-full px-3 py-3 text-base outline-none"
						/>
					</div>
				</div>
			</Modal>
		</div>
	);
}
