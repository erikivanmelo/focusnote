import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NoteCard from './NoteCard';
import {Outlet} from 'react-router-dom';
import Note from '@renderer/models/Note';
import {useGenericQueryNoParams} from '@renderer/hooks/useGenericQuery';
import noteService from '@renderer/services/noteService';

function NoteCardList() {
    const { data: notes, isLoading, isError, error} = useGenericQueryNoParams<Note[]>(
        ["notes"],
        noteService.getAll
    );

    const [searchParams] = useSearchParams();
    const noteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Handle smooth scrolling when noteId is in URL
    useEffect(() => {
        const noteId = searchParams.get('noteId');
        if (noteId && noteRefs.current[noteId]) {
            // Small timeout to ensure the DOM is ready
            const timer = setTimeout(() => {
                const element = noteRefs.current[noteId];
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // Add highlight class and remove it after animation
                    element.classList.add('note-highlight');

                    const highlightTimer = setTimeout(() => {
                        element.classList.remove('note-highlight');
                    }, 2000);

                    return () => clearTimeout(highlightTimer);
                }
                return undefined;
            }, 100);

            return () => clearTimeout(timer);
        }
        return undefined; // Explicitly return undefined for TypeScript
    }, [searchParams, notes]);

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
        content = notes.map(note => (
            <div
                key={note.id}
                ref={(el: HTMLDivElement | null) => {
                    if (el) {
                        noteRefs.current[note.id] = el;
                    } else {
                        delete noteRefs.current[note.id];
                    }
                }}
            >
                <NoteCard note={note} />
            </div>
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
