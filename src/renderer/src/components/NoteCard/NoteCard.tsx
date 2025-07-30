import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import Note from "@renderer/models/Note";
import Tag from "@renderer/models/Tag";
import Color from "@renderer/models/Color";
import noteService from "@renderer/services/noteService";
import { useInvalidateMutation } from "@renderer/hooks/useInvalidateMutation";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { enUS } from "date-fns/locale";
import TiptapEditor, { TiptapEditorRef } from "@renderer/components/TiptapEditor";
import TagInput from '../TagInput';
import ColorSelector from '../ColorSelector';
import "./NoteCard.scss";


interface Props {
    note?: Note | null;
    isModal?: boolean;
    showModal?: boolean;
    mode?: 'view' | 'edit' | 'create';
    onModalClose?: () => void;
    onModalShow?: () => void;
    onModalEdit?: () => void;
}

function NoteCard({
    note = null,
    isModal = false,
    mode = 'view',
    onModalClose = () => {},
    onModalShow = () => {},
    onModalEdit = () => {}
}: Props) {

    if (isModal)
        console.log(note);
    const [currentNote, setCurrentNote] = useState<Note | null>(note);
    const [currentMode, setCurrentMode] = useState<'view' | 'edit' | 'create'>(mode);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMoreButton, setShowMoreButton] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<TiptapEditorRef>(null);

    // Form state
    const defaultColor = useMemo(() => new Color(1, "light", true), []);
    const [selectedColor, setSelectedColor] = useState<Color>(defaultColor);
    const [title, setTitle] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [shakeContent, setShakeContent] = useState<boolean>(false);

    // Mutations
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);
    const createNoteMutation = useInvalidateMutation(["notes"], noteService.create);
    const updateNoteMutation = useInvalidateMutation(["notes"], noteService.update);

    const isEditing = currentMode === 'edit' || currentMode === 'create';
    const isCreating = currentMode === 'create';

    const formattedDate = currentNote?.createdAt
        ? formatDistanceToNow(currentNote.createdAt, {
            addSuffix: true,
            locale: enUS
          })
        : 'Just now';

    // Initialize form data when note changes or mode changes
    useEffect(() => {
        if (isEditing && currentNote) {
            setSelectedColor(currentNote.color || defaultColor);
            setTitle(currentNote.title || "");
            setSelectedTags(currentNote.tags.map((tag) => tag.name));
            editorRef.current?.setContent(currentNote.content);
        } else if (isCreating) {
            setSelectedColor(defaultColor);
            setTitle("");
            setSelectedTags([]);
            editorRef.current?.setContent("");
        }
    }, [currentMode, defaultColor]);

    // Reset form on successful mutation
    useEffect(() => {
        if (deleteNoteMutation.isSuccess) {
            if (isModal)
                onModalClose();
            toast.success('Note deleted successfully!');
            return;
        }
        if (deleteNoteMutation.isError) {
            toast.error('There was an error deleting the note');
            return;
        }
        if (createNoteMutation.isError || updateNoteMutation.isError) {
            toast.error('There was an error saving the note');
            return;
        }
        if (createNoteMutation.isSuccess || updateNoteMutation.isSuccess) {
            const newNote: Note | undefined = (createNoteMutation.isSuccess ? createNoteMutation.data : updateNoteMutation.data)
            if (!newNote)
                return
            if (mode === 'create') {
                onModalClose();
            } else {
                setCurrentNote(newNote);
            }
            return;
        }
    }, [createNoteMutation.isSuccess, updateNoteMutation.isSuccess, deleteNoteMutation.isSuccess]);

    const handleDeleteNote = async () => {
        if (currentNote) {
            deleteNoteMutation.mutate(currentNote.id);
        }
        setShowDeleteModal(false);
    };

    const handleSave = useCallback(async () => {
        const currentContent = editorRef.current?.getContent().trim() || '';
        const isContentEmpty = currentContent === '' || currentContent === "<p></p>";

        if (isContentEmpty) {
            setShakeContent(true);
            setTimeout(() => {
                setShakeContent(false);
            }, 1000);
            return;
        }

        const noteData = new Note(
            currentNote?.id || -1,
            title.trim(),
            currentContent,
            selectedColor,
            selectedTags.map((tagName) => new Tag(-1, tagName))
        );

        if (isCreating) {
            createNoteMutation.mutate(noteData);
        } else {
            updateNoteMutation.mutate(noteData);
        }

    }, [title, selectedColor, selectedTags, currentNote, createNoteMutation, updateNoteMutation, isCreating]);

    const handleBack = () => {
        if ( ((currentMode == 'edit' && mode == 'edit') || currentMode == 'view') || currentMode == 'create')
            onModalClose();
        else
            setCurrentMode('view')
    };

    const handleEdit = () => {
        if (isModal)
            setCurrentMode('edit');
        else
            onModalEdit();
    };

    const handleAddTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            return false;
        }
        setSelectedTags([...selectedTags, tag]);
        return true;
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter")
            editorRef.current?.focus();
    };

    // Check content height for "Ver más" button
    useEffect(() => {
        if (isModal || isEditing) {
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
    }, [currentNote?.content, isModal, isEditing]);

    const isPending = createNoteMutation.isPending || updateNoteMutation.isPending || deleteNoteMutation.isPending;

    const content = (
        <>
            <div
                id={`note-${note?.id || 'new'}`}
                className={`note-card ${(isEditing ? selectedColor?.name : currentNote?.color?.name) || 'light'} ${(isModal || isEditing) && ' modal'}`}
            >
                <div className="header">
                    <div className="meta">
                        <span className="time">
                            {isEditing
                                ? (isCreating ? "Creating note" : "Editing note")
                                : formattedDate
                            }
                        </span>

                        {isPending && (
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                                <span>Saving...</span>
                            </div>
                        )}

                    </div>
                    <div className="actions">
                        {!isEditing ? (
                            <>
                                {!isModal &&
                                    <button
                                        className="action"
                                        onClick={onModalShow}
                                        title="Open as popup"
                                    >
                                        <i className="bi bi-arrows-fullscreen" />
                                    </button>
                                }
                                <button
                                    className="action"
                                    onClick={handleEdit}
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
                            </>
                        ) : (
                            <ColorSelector
                                value={selectedColor}
                                onChange={setSelectedColor}
                            />
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={40}
                        id="title"
                        type="text"
                        placeholder="Note title"
                        className="title"
                        onKeyDown={handleTitleKeyDown}
                    />
                ) : (
                    currentNote?.title && (
                        <span className="title">
                            {currentNote.title}
                        </span>
                    )
                )}


                <div className="content-wrapper">
                    {isEditing ? (
                        <TiptapEditor
                            ref={editorRef}
                            placeholder="What do you have to tell today?"
                            className={`content ${shakeContent ? 'shake-animation' : ''}`}
                        />
                    ) : (
                        <>
                            <div
                                ref={contentRef}
                                className={`content ${!isModal && showMoreButton ? 'content--limited' : ''}`}
                                dangerouslySetInnerHTML={{ __html: currentNote?.content || '' }}
                            />
                            {!isModal && showMoreButton && (
                                <div className="content-overlay">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={onModalShow}
                                    >
                                        See more
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {isEditing ? (
                    <div className="edit-tags-actions-row">
                        <div style={{ flex: 1 }}>
                            <TagInput
                                tags={selectedTags}
                                onSubmit={handleAddTag}
                                onRemove={handleRemoveTag}
                            />
                        </div>
                        <button
                            className="action-button ms-3 rounded-pill"
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            Save
                        </button>
                    </div>
                ) : (
                    currentNote?.tags && currentNote.tags.length > 0 && (
                        <div className="tags d-flex flex-wrap gap-1">
                            {currentNote.tags.map((tag) => (
                                <span key={tag.id} className="badge bg-primary d-flex align-items-center">
                                    <i className="bi bi-tag"></i>
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )
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
                        Are you sure you want to delete "{currentNote?.title || 'this note'}"? This action cannot be undone.
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

    if (!isModal)
        return content;

    return (
        <Modal
            show={true}
            backdrop={true}
            keyboard={true}
            centered={true}
            dialogClassName="minimalist-modal notes-container"
            contentClassName='minimalist-modal-content'
            animation={true}
        >
            <div className="modal-close-button-wrapper">
                <button
                    className="close-button"
                    onClick={ handleBack }
                    aria-label="Go back"
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>
            <Modal.Body className='p-0'>
                {content}
            </Modal.Body>
        </Modal>
    );
}

export default NoteCard;
