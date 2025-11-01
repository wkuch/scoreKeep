import { useEffect, useRef, useState } from 'react';

type ModalProps = {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children, footer }: ModalProps) {
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [vvh, setVvh] = useState<number>(typeof window !== 'undefined' ? (window.visualViewport?.height ?? window.innerHeight) : 0);
	const [bottomInset, setBottomInset] = useState<number>(0);

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	useEffect(() => {
		if (!open) return;
		const vv = window.visualViewport;
		function update() {
			const height = vv?.height ?? window.innerHeight;
			setVvh(height);
			const inset = Math.max(0, (window.innerHeight - height - (vv?.offsetTop ?? 0)));
			setBottomInset(inset);
		}
		update();
		vv?.addEventListener('resize', update);
		vv?.addEventListener('scroll', update);
		return () => {
			vv?.removeEventListener('resize', update);
			vv?.removeEventListener('scroll', update);
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		function onFocusIn(e: FocusEvent) {
			const target = e.target as HTMLElement;
			if (!target) return;
			panelRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		}
		document.addEventListener('focusin', onFocusIn);
		return () => document.removeEventListener('focusin', onFocusIn);
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-40">
			<div
				className="absolute inset-0 bg-black/60"
				onClick={() => onClose()}
				aria-hidden="true"
			/>
			{/* Scrollable container honoring dynamic viewport height with safe-area + keyboard insets */}
			<div className="absolute inset-0 overflow-y-auto">
				<div
					className="flex items-center justify-center p-4"
					style={{ minHeight: `${vvh}px`, paddingBottom: `max(${bottomInset}px, 16px)` }}
				>
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


