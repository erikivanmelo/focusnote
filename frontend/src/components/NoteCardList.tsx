import NoteCard from './NoteCard';
import { useFetch } from '../hooks/useFetch';
import noteService from '../services/noteService';

function NoteCardList() {
    const { data: notes, loading, error } = useFetch(noteService.fetchAll);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
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

    return (
        <>
            {notes.map(note => (
                <NoteCard key={note.id} note={note} />
            ))}
        </>
    );
}

export default NoteCardList;
