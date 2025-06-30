import { Modal } from "react-bootstrap";
import NoteForm from "./NoteForm";
import { useNavigate, useParams } from 'react-router-dom';
import noteService from "@renderer/services/noteService";
import { useGenericQuery } from "@renderer/hooks/useGenericQuery";
import {ROUTES} from "@renderer/routes/routesConfig";
import './ModalNoteForm.scss';

interface ModalNoteFormProps {
	action: "Update" | "Publish";
}

export function ModalNoteForm({ action }: ModalNoteFormProps) {
    const navigate = useNavigate();
	const { id } = useParams();
	const { data: note } = id? useGenericQuery(
		["note"],
		noteService.getOne,
		Number(id)
	) : {data: null};

	const handleClose = () => {
		navigate(ROUTES.HOME, { replace: true });
	};

	return (
		<Modal
			show={true}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered
			dialogClassName='minimalist-modal'
			contentClassName='minimalist-modal-content'
		>
			<Modal.Body className='p-0'>
				<div className="modal-header-minimal">
					<button
						className="close-button"
						onClick={handleClose}
						aria-label="Close"
					>
						×
					</button>
				</div>
				<NoteForm
					note={note}
					action={action}
					onSuccess={handleClose}
				/>
			</Modal.Body>
		</Modal>
	);
}
export default ModalNoteForm;
