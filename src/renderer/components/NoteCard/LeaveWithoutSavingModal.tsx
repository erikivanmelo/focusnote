import { Modal, Button } from "react-bootstrap";

interface LeaveWithoutSavingModalProps {
  show: boolean;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LeaveWithoutSavingModal({
  show,
  isSaving,
  onClose,
  onConfirm,
}: LeaveWithoutSavingModalProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="confirmation-modal"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <i className="bi bi-exclamation-diamond-fill text-warning"></i>
          Unsaved Changes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-4">
        <div className="modal-icon text-warning">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <p>
          You have <strong>unsaved changes</strong>.<br />
          Are you sure you want to leave this page?
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isSaving}
        >
          <i className="bi bi-x-lg me-1"></i>
          Cancel
        </Button>
        <Button
          variant="warning"
          onClick={onConfirm}
          disabled={isSaving}
          className="text-dark"
        >
          <i className="bi bi-arrow-left me-1"></i>
          {isSaving ? 'Saving...' : 'Leave Without Saving'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
