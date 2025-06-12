import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Note from "../models/Note";
import noteService from "../services/noteService";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routesConfig";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { enUS } from "date-fns/locale";
import "./NoteCard.css";

interface Props {
    note: Note;
}

function NoteCard({ note }: Props) {
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark'));

    // Watch for theme changes
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.body.classList.contains('dark'));
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const formattedDate = note.createdAt
        ? formatDistanceToNow(new Date(note.createdAt), {
            addSuffix: true,
            locale: enUS
          })
        : 'Just now';

    const handleDeleteNote = async () => {
        deleteNoteMutation.mutate(note.id);
        setShowModal(false);
    };

    return (
        <>
            <div
                className={`note-card ${note.color?.name || 'default'}`}
                data-bs-theme={isDarkMode ? 'dark' : 'light'}
            >
                <div className="note-card__header">
                    <div className="note-card__meta">
                        <span className="note-card__time">{formattedDate}</span>
                        <span className="note-card__id">#{note.id}</span>
                    </div>
                    <div className="note-card__actions">
                        <button
                            className="note-card__action"
                            onClick={() => navigate(ROUTES.NOTE_EDIT(note.id))}
                            title="Edit note"
                        >
                            <i className="bi bi-pencil" />
                        </button>
                        <button
                            className="note-card__action note-card__action--danger"
                            onClick={() => setShowModal(true)}
                            title="Delete note"
                        >
                            <i className="bi bi-trash" />
                        </button>
                    </div>
                </div>

                {note.title && (
                    <h3 className="note-card__title">
                        {note.title}
                    </h3>
                )}

                <div
                    className="note-card__content"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />

                {note.tags.length > 0 && (
                    <div className="note-card__tags">
                        {note.tags.map((tag) => (
                            <span key={tag.id} className="note-card__tag">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Note Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                className="delete-modal"
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Delete Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">
                        Are you sure you want to delete "{note.title || 'this note'}"? This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowModal(false)}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteNote}
                        className="px-4"
                    >
                        <i className="bi bi-trash me-2"></i>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NoteCard;
