import NoteCard from './NoteCard';
import { useGenericQueryNoParams } from '../hooks/useGenericQuery';
import noteService from '../services/noteService';
import { Modal, Button } from 'react-bootstrap';
import {useState} from 'react';
import NoteForm from './NoteForm';
import Note from '../models/Note';

function NoteCardList() {
    const { data: notes, isLoading, isError } = useGenericQueryNoParams(["notes"], noteService.getAll);


    const [isModalEditorShowed, setIsModalEditorShowed] = useState<boolean>(false);
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <span>Failed to load notes. Please try again.</span>
            </div>
        );
    }

    if (!notes || notes.length === 0) {
        return (
            <div className="alert alert-info">
                <i className="bi bi-journal me-2"></i>
                <span>No notes yet. Create your first one!</span>
            </div>
        );
    }


    const handleToEdit = (note: Note) => {
        setNoteToEdit(note);
        setIsModalEditorShowed(true);
    }

    return (
        <>
            {notes.map(note => (
                <NoteCard 
                    key={note.id} 
                    note={note}
                    onEdit={handleToEdit}
                />
            ))}

            
            <Modal
                show={isModalEditorShowed} 
                onHide={() => setIsModalEditorShowed(false)} 
                backdrop="static"
                keyboard={false}
                centered
                dialogClassName='modal-xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Note Editor</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0 m-0'>
                    <NoteForm 
                        note={noteToEdit}
                        action="Update"
                        resetAfterSend={false}
                    />
                </Modal.Body>
            </Modal>

        </>
    );
}

export default NoteCardList;
