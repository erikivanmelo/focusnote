import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import NoteCard from './NoteCard';
import Note from '@renderer/models/Note';
import {useGenericQueryNoParams} from '@renderer/hooks/useGenericQuery';
import noteService from '@renderer/services/noteService';

function NoteCardList() {
    const { data: notes, isLoading, isError, error} = useGenericQueryNoParams<Note[]>(
        ["notes"],
        noteService.getAll
    );

    const [searchParams] = useSearchParams();

    // Handle smooth scrolling when noteId is in URL
    useEffect(() => {
        const noteId = searchParams.get('noteId');
        if (!noteId) return;

        const timer = setTimeout(() => {
            const titleElement = document.querySelector(`#note-${noteId} .note-title`) as HTMLElement;
            const cardElement = document.getElementById(`note-${noteId}`);

            if (titleElement) {
                // Scroll to title with offset for header
                const offset = 20;
                const top = titleElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            } else if (cardElement) {
                // Fallback to card if title not found
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Add highlight effect
            if (cardElement) {
                cardElement.classList.add('note-highlight');
                setTimeout(() => cardElement.classList.remove('note-highlight'), 2000);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [searchParams]);

    let content: React.ReactNode;
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
        content = notes.map(note => (
            <NoteCard note={note} key={note.id}/>
        ));
    }

    return (
        <>
            {content}
            <Outlet />
        </>
    );
}

export default NoteCardList;
