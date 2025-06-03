import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Note from "../models/Note";
import noteService from "../services/noteService";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../routes/routesConfig";

interface Props {
    note: Note;
}

function NoteCard({ note }: Props) {
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const date = note.createdAt?.toLocaleDateString() ?? "00/00/00";
    const time = note.createdAt?.toLocaleTimeString() ?? "00:00:00";

    const handleDeleteNote = async () => {
        deleteNoteMutation.mutate(note.id);
        setShowModal(false);
    };

    return (
        <>
            <div className={`card mb-3 shadow mt-4 bc-callout card-${note.color.name}`}>
                <div className="card-body">
                    {/* Header */}
                    <div className="text-body-secondary mb-2">
                        <small>
                            <strong>#{note.id}</strong> Published on {date} at {time}
                        </small>

                        <div className="float-end">
                            <button className="btn rounded-circle border" onClick={() => setShowModal(true)}>
                                <i className="bi bi-trash" />
                            </button>
                            <button className="btn rounded-circle ms-2 border" onClick={() => navigate(ROUTES.NOTE_EDIT(note.id))}>
                                <i className="bi bi-pencil" />
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="card-title">
                        {note.title && (
                            <>
                                <span className="h2 col-11">{note.title}</span>
                                <hr />
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="text-body" dangerouslySetInnerHTML={{ __html: note.content }} />

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

            {/* Delete Note Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this note? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteNote}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NoteCard;
