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
					<button className="btn flex-1 px-4 py-3" onClick={onClose}>
						{cancelText}
					</button>
					<button
						className="btn flex-1 px-4 py-3 font-semibold"
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
			{description && <p className="text-sm text-muted">{description}</p>}
		</Modal>
	);
}


