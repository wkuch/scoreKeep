import { useEffect, useRef } from 'react';

type ModalProps = {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children, footer }: ModalProps) {
	const panelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-40">
			<div
				className="absolute inset-0 bg-black/60"
				onClick={() => onClose()}
				aria-hidden="true"
			/>
			<div className="absolute inset-0 grid place-items-center p-4">
				<div
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					className="w-full max-w-sm overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-neutral-700 shadow-xl"
				>
					{title && (
						<div className="border-b border-neutral-800 px-5 py-4 text-base font-semibold text-white">
							{title}
						</div>
					)}
					<div className="px-5 py-4 text-neutral-200">{children}</div>
					{footer && <div className="flex gap-2 border-t border-neutral-800 px-5 py-4">{footer}</div>}
				</div>
			</div>
		</div>
	);
}


