import Modal from './Modal';
import Button from './Button';
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  loading,
}) {
  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <p className="text-sm text-zinc-600 mb-6">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
