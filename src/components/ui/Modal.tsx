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
			{/* Scrollable container honoring dynamic viewport height with safe-area padding */}
			<div className="absolute inset-0 overflow-y-auto">
				<div className="min-h-[100dvh] flex items-center justify-center p-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
					<div
						ref={panelRef}
						role="dialog"
						aria-modal="true"
						className="w-full max-w-sm rounded-2xl bg-neutral-900 ring-1 ring-neutral-700 shadow-xl flex flex-col max-h-[90dvh]"
					>
						{title && (
							<div className="border-b border-neutral-800 px-5 py-4 text-base font-semibold text-white">
								{title}
							</div>
						)}
						<div className="px-5 py-4 text-neutral-200 overflow-y-auto">{children}</div>
						{footer && <div className="flex gap-2 border-t border-neutral-800 px-5 py-4">{footer}</div>}
					</div>
				</div>
			</div>
		</div>
	);
}


