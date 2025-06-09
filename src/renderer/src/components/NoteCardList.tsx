import NoteCard from './NoteCard';
import { useGenericQueryNoParams } from '../hooks/useGenericQuery';
import noteService from '../services/noteService';
import {Outlet} from 'react-router-dom';

function NoteCardList() {
    const { data: notes, isLoading, isError, error } = useGenericQueryNoParams(["notes"], noteService.getAll);

    // Log para depuración
    console.log('[NoteCardList] notes:', notes, 'isLoading:', isLoading, 'isError:', isError, 'error:', error);

    let content;
    if (isLoading) {
        content = (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );

    } else if (isError) {
        content = (
            <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <span>Failed to load notes. Please try again.</span>
                {error && <div className="mt-2 small text-muted">{error instanceof Error ? error.message : String(error)}</div>}
            </div>
        );

    } else if (!notes || notes.length === 0) {
        content = (
            <div className="alert alert-info">
                <i className="bi bi-journal me-2"></i>
                <span>No notes yet. Create your first one!</span>
            </div>
        );

    } else {
        content = (
            notes.map(note => (
                <NoteCard
                    key={note.id}
                    note={note}
                />
            ))
        )
    }

    return (
        <>
            {content}
            <Outlet />
        </>
    );
}

export default NoteCardList;
