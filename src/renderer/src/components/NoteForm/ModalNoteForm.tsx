import { RouteModal } from "@renderer/components/Modal";
import NoteForm from "./NoteForm";
import { useNavigate, useParams } from 'react-router-dom';
import noteService from "@renderer/services/noteService";
import { useGenericQuery } from "@renderer/hooks/useGenericQuery";

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

	return (
		<RouteModal
			backdrop="static"
			keyboard={false}
			centered
		>
			<NoteForm
				note={note}
				action={action}
                onSuccess={ () => navigate(-1) }
			/>
		</RouteModal>
	);
}
export default ModalNoteForm;
