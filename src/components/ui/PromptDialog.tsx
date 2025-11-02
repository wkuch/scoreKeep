import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';

type PromptDialogProps = {
	open: boolean;
	title: string;
	label?: string;
	initialValue?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: (value: string) => void;
	onClose: () => void;
};

export default function PromptDialog({ open, title, label, initialValue = '', confirmText = 'Save', cancelText = 'Cancel', onConfirm, onClose }: PromptDialogProps) {
	const [value, setValue] = useState(initialValue);
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (open) {
			setValue(initialValue);
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [open, initialValue]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={title}
			footer={
				<>
					<button className="btn flex-1 px-4 py-3" onClick={onClose}>
						{cancelText}
					</button>
					<button
						className="btn flex-1 px-4 py-3 font-semibold"
						onClick={() => {
							const trimmed = value.trim();
							if (!trimmed) return;
							onConfirm(trimmed);
							onClose();
						}}
					>
						{confirmText}
					</button>
				</>
			}
		>
			<div className="space-y-2">
				{label && <label className="block text-sm text-muted">{label}</label>}
				<input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="input w-full px-3 py-3 text-base outline-none"
				/>
			</div>
		</Modal>
	);
}


