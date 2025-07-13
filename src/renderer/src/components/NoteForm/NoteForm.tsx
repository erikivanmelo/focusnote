import React, {useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useInvalidateMutation } from "@renderer/hooks/useInvalidateMutation";
import Note from "@renderer/models/Note";
import Tag from "@renderer/models/Tag";
import Color from "@renderer/models/Color";
import DisableLayer from "../DisableLayer";
import TiptapEditor, { TiptapEditorRef } from "@renderer/components/TiptapEditor";
import noteService from '@renderer/services/noteService';
import './NoteForm.scss';
import TagInput from '../TagInput';
import ColorSelector from '../ColorSelector';

interface NoteFormProp{
    note?: Note | null;
    action: "Update" | "Publish";
    onSuccess?: () => void
}

function NoteForm({
        note = null,
        action,
        onSuccess
}: NoteFormProp) {
    const defaultColor = useMemo(() => new Color(1, "light", true), []);

    const mutator = useInvalidateMutation(
        ["notes", "note"],
        action === 'Publish' ? noteService.create : noteService.update,
    );

    //Inputs
    const [selectedColor, setSelectedColor] = useState<Color>(defaultColor);
    const [title        , setTitle        ] = useState<string  >("");
    const [selectedTags , setSelectedTags ] = useState<string[]>([]);

    const [shakeContent, setShakeContent] = useState<boolean>(false);

    const contentRef = useRef<TiptapEditorRef>(null);

    useEffect(() => {
        if (!note)
            return;
        setSelectedColor(note?.color);
        setTitle(note?.title);
        setSelectedTags(note?.tags.map((tag) => tag.name));
        contentRef.current?.setContent(note.content);
    }, [note]);

    useEffect(() => {
        if (mutator.isSuccess){
            setSelectedColor(defaultColor)
            setTitle("");
            setSelectedTags([]);
            contentRef.current?.setContent("")
            if (onSuccess)
                onSuccess();
        }
    }, [
        mutator.isSuccess,
        defaultColor,
        onSuccess
    ]);

    const publish = useCallback(async () => {
        const currentContent = contentRef.current?.getContent().trim() || '';
        const isContentEmpty = currentContent === '' || currentContent === "<p></p>";

        if (isContentEmpty) {
            setShakeContent(isContentEmpty);

            setTimeout(() => {
                setShakeContent(false);
            }, 1000);
            return;
        }

        const newNote = new Note(
            note? note.id : -1,
            title.trim(),
            currentContent,
            selectedColor,
            selectedTags.map((tagName) => new Tag(-1, tagName))
        );
        mutator.mutate(newNote)
    }, [title, selectedColor, selectedTags, note, mutator]);

    const handleRemoveTag = (name: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== name));
    };

    const handleAddTag = (newTag: string) => {
        if (selectedTags.includes(newTag))
            return false;

        setSelectedTags([...selectedTags, newTag]);
        return true;
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter")
            contentRef.current?.focus();
    };

    // Usar el mismo diseño de tarjeta para ambos modos
    return (
        <div
            id={`note-${note?.id || 'new'}`}
            className={`note-card ${selectedColor?.name || 'light'} no-hover-effect` }
            style={mutator.isPending? {  "filter": "blur(2px)" } : {}}
        >
            <div className="header">
                <div className="meta">
                    <span className="time">{action === "Update" ? "Editing note" : "Creating note"}</span>
                    <span className="id">#{note?.id || 'new'}</span>
                </div>
                <div className="actions">
                    <ColorSelector
                        value={selectedColor}
                        onChange={setSelectedColor}
                    />
                </div>
            </div>

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

            <div className="content-wrapper">
                <TiptapEditor
                    ref={contentRef}
                    placeholder="What do you have to tell today?"
                    className={`content ${shakeContent ? 'shake-animation' : ''}`}
                />
            </div>

            {selectedTags.length > 0 && (
                <div className="tags d-flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                        <span key={tag} className="badge bg-primary d-flex align-items-center">
                            <i className="bi bi-tag"></i>
                            {tag}
                            <button
                                type="button"
                                className="btn-close btn-close-white btn-sm ms-1"
                                onClick={() => handleRemoveTag(tag)}
                                aria-label={`Remove ${tag}`}
                            />
                        </span>
                    ))}
                </div>
            )}

            <div className="tag-input-container">
                <input
                    type="text"
                    placeholder="Add tags..."
                    className="form-control"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            handleAddTag(e.currentTarget.value.trim());
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>

            <div className="form-actions">
                {mutator.isPending && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <span>{action === "Update" ? "Saving..." : "Sending..."}</span>
                    </div>
                )}
                <button
                    className="action-button"
                    onClick={publish}
                    disabled={mutator.isPending}
                >
                    {action}
                </button>
            </div>

            <DisableLayer disabled={mutator.isPending} />
        </div>
    );
};

export default NoteForm;

