import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Note from "@renderer/models/Note";
import noteService from "@renderer/services/noteService";
import { useInvalidateMutation } from "@renderer/hooks/useInvalidateMutation";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@renderer/routes/routesConfig";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { enUS } from "date-fns/locale";
import "./NoteCard.scss";

interface Props {
    note: Note;
    isModal?: boolean;
}

function NoteCard({ note, isModal = false }: Props) {
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const formattedDate = note.createdAt
        ? formatDistanceToNow(note.createdAt, {
            addSuffix: true,
            locale: enUS
          })
        : 'Just now';

    const handleDeleteNote = async () => {
        deleteNoteMutation.mutate(note.id);
        setShowDeleteModal(false);
    };

    useEffect(() => {
        if (isModal) {
            setShowMoreButton(false);
            return;
        }
        const checkContentHeight = () => {
            if (contentRef.current) {
                const element = contentRef.current;
                const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
                const maxHeight = lineHeight * 10;
                setShowMoreButton(element.scrollHeight > maxHeight);
            }
        };
        const timer = setTimeout(checkContentHeight, 100);
        return () => clearTimeout(timer);
    }, [note.content, isModal]);

    return (
        <>
            <div
                id={`note-${note.id}`}
                className={`note-card ${note.color?.name || 'light'}`}
            >
                <div className="header">
                    <div className="meta">
                        <span className="time">{formattedDate}</span>
                        <span className="id">#{note.id}</span>
                    </div>
                    <div className="actions">
                        <button
                            className="action"
                            onClick={() => navigate(ROUTES.NOTE_EDIT(note.id))}
                            title="Edit note"
                        >
                            <i className="bi bi-pencil" />
                        </button>
                        <button
                            className="action action--danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteModal(true);
                            }}
                            title="Delete note"
                        >
                            <i className="bi bi-trash" />
                        </button>
                    </div>
                </div>

                {note.title && (
                    <span className="title">
                        {note.title}
                    </span>
                )}

                <div className="content-wrapper">
                    <div
                        ref={contentRef}
                        className={`content ${!isModal && showMoreButton ? 'content--limited' : ''}`}
                        dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                    {!isModal && showMoreButton && (
                        <div className="content-overlay">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => navigate(ROUTES.NOTES + '/' + note.id)}
                            >
                                Ver más
                            </button>
                        </div>
                    )}
                </div>

                {note.tags.length > 0 && (
                    <div className="tags d-flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                            <span key={tag.id} className="badge bg-primary d-flex align-items-center">
                                <i className="bi bi-tag"></i>
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Note Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                className="delete-modal"
            >
                <Modal.Header closeButton>
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
                        onClick={() => setShowDeleteModal(false)}
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
