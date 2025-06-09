import { Modal } from "react-bootstrap";
import NoteForm from "./NoteForm";
import { useNavigate, useParams } from 'react-router-dom';
import noteService from "../services/noteService";
import { useGenericQuery } from "../hooks/useGenericQuery";
import {ROUTES} from "../routes/routesConfig";
import {useEffect} from "react";

interface ModalNoteFormProps {
	action: "Update" | "Publish";
}

export function ModalNoteForm({ action }: ModalNoteFormProps) {
    const navigate = useNavigate();
	const { id } = useParams();
	const { data: note } = useGenericQuery(
		["note"], 
		noteService.getOne, 
		Number(id)
	);

	useEffect(() => {
		// Ensure modal shows when component mounts
		const modal = document.querySelector('.modal');
		if (modal) {
			modal.classList.add('show');
			modal.style.display = 'block';
		}
	}, []);

	const handleClose = () => {
		if (window.history.state?.hasInitialModal) {
			navigate(ROUTES.HOME, { replace: true });
		} else {
			navigate(-1);
		}
	};

	return (
		<Modal
			show={true}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered
			dialogClassName='modal-lg'
		>
			<Modal.Header closeButton>
				<Modal.Title>Note Editor</Modal.Title>
			</Modal.Header>
			<Modal.Body className='p-0 m-0'>
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
