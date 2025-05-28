import Note from "../models/Note";
import noteService from "../services/noteService";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import OptionMenu, { OptionMenuItem } from "./OptionMenu";

interface Props {
    note: Note;
}

function NoteCard({ note }: Props) {
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);

    const date = note.createdAt?.toLocaleDateString()?? "00/00/00";
    const time = note.createdAt?.toLocaleTimeString()?? "00:00:00";

    const handleDeleteNote = async (noteId: number) => {
        deleteNoteMutation.mutate(noteId);
    };

    return (
        <div className={`card mb-3 shadow mt-4 bc-callout card-${note.color.name}`}>
            <div className="card-body">
                {/* Header */}
                <div className="text-body-secondary mb-2">
                    <small>
                        <strong>#{note.id}</strong> Published on {date} at {time}
                    </small>

                    <OptionMenu className="float-end">
                        <OptionMenuItem onClick={() => handleDeleteNote(note.id)}>
                            <i className="bi bi-trash" /> Eliminar
                        </OptionMenuItem>
                        <OptionMenuItem>
                            <i className="bi bi-pencil" /> Editar
                        </OptionMenuItem>
                    </OptionMenu>
                </div>


                {/* Title */}
                <div className="card-title row">
                    {note.title && 
                    <>
                        <span className="h2 col-11">{note.title}</span>
                        <hr/>
                    </>
                    }
                </div>

                {/* Content */}
                <p className="text-body">
                    <div dangerouslySetInnerHTML={{ __html: note.content }} />
                </p>

                {/* Tags */}
                <div className="tags">
                    {note.tags.map((tag) => (
                        <a key={tag.id} href="#">
                            #{tag.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NoteCard;
