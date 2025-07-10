import { RouteModal } from "@renderer/components/Modal";
import { useParams } from "react-router-dom";
import NoteCard from "./NoteCard";
import {useGenericQuery} from "@renderer/hooks/useGenericQuery";
import noteService from "@renderer/services/noteService";

export function ModalNoteCard() {
	const { id } = useParams();
	const { data: note } = id? useGenericQuery(
		["note"],
		noteService.getOne,
		Number(id)
	) : {data: null};

    if (!note) {
        return null;
    }

    return (
        <RouteModal size="lg">
            <NoteCard note={note} isModal={true} />
        </RouteModal>
    );
}

export default ModalNoteCard;
