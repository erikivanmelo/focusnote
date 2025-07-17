import { useState } from 'react';
import NoteCard from './NoteCard';
import Note from '@renderer/models/Note';
import {useGenericQueryNoParams} from '@renderer/hooks/useGenericQuery';
import noteService from '@renderer/services/noteService';

function NoteCardList() {
    const { data: notes, isLoading, isError, error} = useGenericQueryNoParams<Note[]>(
        ["notes"],
        noteService.getAll
    );

    const [currentModalNote, setCurrentModalNote] = useState<Note | null>(null);
    const [currentModalMode, setCurrentModalMode] = useState<'view' | 'edit' | 'create'>('view');

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
        content = (<>

            {notes.map( (note) => (
                <NoteCard
                    note={note}
                    key={note.id}
                    onModalShow={() => {setCurrentModalMode('view'); setCurrentModalNote(note)}}
                    onModalEdit={() => {setCurrentModalMode('edit'); setCurrentModalNote(note)}}
                />
            ))}

            {currentModalNote &&
                <NoteCard
                    note={currentModalNote}
                    isModal={true}
                    mode={currentModalMode}
                    onModalClose={() => {setCurrentModalNote(null)}}
                />
            }

        </>);
    }

    return (
        <>
            {content}
        </>
    );
}

export default NoteCardList;
