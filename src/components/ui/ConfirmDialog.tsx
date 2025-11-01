import Modal from './Modal';

type ConfirmDialogProps = {
	open: boolean;
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onClose: () => void;
};

export default function ConfirmDialog({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose }: ConfirmDialogProps) {
	return (
		<Modal
			open={open}
			onClose={onClose}
			title={title}
			footer={
				<>
					<button
						className="flex-1 rounded-lg bg-neutral-800 px-4 py-3 text-white ring-1 ring-neutral-700"
						onClick={onClose}
					>
						{cancelText}
					</button>
					<button
						className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white"
						onClick={() => {
							onConfirm();
							onClose();
						}}
					>
						{confirmText}
					</button>
				</>
			}
		>
			{description && <p className="text-sm text-neutral-300">{description}</p>}
		</Modal>
	);
}


