import { Modal, Button } from "react-bootstrap";

interface DeleteConfirmationModalProps {
  show: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  show,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="confirmation-modal"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle-fill text-danger"></i>
          Delete Note
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-4">
        <div className="modal-icon">
          <i className="bi bi-trash3"></i>
        </div>
        <p>
          Are you sure you want to delete this note?<br />
          This action <strong>cannot</strong> be undone.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isDeleting}
        >
          <i className="bi bi-x-lg me-1"></i>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={isDeleting}
          className="d-flex align-items-center"
        >
          {isDeleting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Deleting...
            </>
          ) : (
            <>
              <i className="bi bi-trash3 me-1"></i>
              Delete Note
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
