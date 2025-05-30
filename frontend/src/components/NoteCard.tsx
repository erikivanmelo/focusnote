import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Note from "../models/Note";
import noteService from "../services/noteService";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import OptionMenu, { OptionMenuItem } from "./OptionMenu";

interface Props {
    note: Note;
}

function NoteCard({ note }: Props) {
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);

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
                            <button className="btn rounded-circle ms-2 border">
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

            {/* Confirmation Modal */}
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
