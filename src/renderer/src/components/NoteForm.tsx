import React, {useRef, useCallback, useEffect, useMemo, useState } from 'react';
import './NoteForm.css';
import { useGenericQueryNoParams } from "../hooks/useGenericQuery";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import noteService from '../services/noteService';
import colorService from "../services/colorService";
import tagService from "../services/tagService";
import Note from "../models/Note";
import Tag from "../models/Tag";
import Color from "../models/Color";
import DisableLayer from "./DisableLayer";
import TiptapEditor, { TiptapEditorRef } from "./TiptapEditor";

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

    return (
        <div className="card shadow form-wrapper">
            <div className="card-body">
                <div className="card-text" style={mutator.isPending? {  "filter": "blur(4px)" } : {}}>
                    <ColorSelector
                        value={selectedColor}
                        onChange={setSelectedColor}
                    />

                    {/* Title Input */}
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="form-control mb-2 mt-4 fs-2 "
                        onKeyDown={handleTitleKeyDown}
                    />

                    {/* Content Input */}
                    <TiptapEditor
                        ref={contentRef}
                        placeholder="What do you have to tell today?"
                        className={(shakeContent ? 'shake-animation' : '')}
                    />

                    <TagInput
                        tags={selectedTags}
                        onSubmit={handleAddTag}
                        onRemove={handleRemoveTag}
                    />
                </div>
            </div>
            <div className="card-footer">
                { mutator.isPending &&
                    <div className="float-start mt-2">
                        <div
                            className="spinner-border"
                            style={{
                                "width": '25px',
                                "height": '25px',
                                "borderWidth": "5px",
                                "paddingTop": '5px',
                                "position": "absolute"
                            }}>
                            <span className="visually-hidden"></span>
                        </div>
                        <div className="ps-5">
                            Sending...
                        </div>
                    </div>
                }

                <button className="btn btn-primary rounded-pill float-end" onClick={publish}>{action}</button>
            </div>
            <DisableLayer disabled={mutator.isPending} />
        </div>
    );
};


interface ColorSelectorProps {
    value   : Color;
    onChange: (color: Color) => void;
}

function ColorSelector({ value, onChange }: ColorSelectorProps) {
    const {data: colors} = useGenericQueryNoParams<Array<Color>>(["colors"], colorService.getAll);

    return (
        <div className="input-colors">
            {colors?.map((color: Color) => (
                <label key={color.id}>
                    <input
                        type="radio"
                        value={color.name}
                        checked={color.id === value.id}
                        onChange={() => onChange(color)}
                    />
                    <span className="checkmark"></span>
                </label>
            ))}
        </div>
    );
}


interface TagInputProps {
	tags: string[];
	onSubmit: (tag: string) => boolean;
	onRemove: (tag: string) => void;
}

function TagInput({ tags, onSubmit, onRemove }: TagInputProps) {
	const initialSuggestions = useGenericQueryNoParams<string[]>(["tags"], tagService.getAllNames);
	const [inputValue , setInputValue ] = useState("");

    const suggestions = useMemo(() => {
        if (!initialSuggestions.isSuccess || !initialSuggestions.data) return [];
        return initialSuggestions.data.filter(tag => !tags.includes(tag));
    }, [
        initialSuggestions.isSuccess,
        initialSuggestions.data,
        tags
    ]);

	const handleKeyDown = useCallback(
         (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter")
                return;

            if (onSubmit(inputValue.trim()))
                setInputValue("");
		},
		[inputValue, onSubmit]
	);

    const handleAddTag = useCallback(() => {
            if (onSubmit(inputValue.trim()))
                setInputValue("");
		},
		[inputValue, onSubmit]
	);


	return (
		<>
			<ul id="tag-pills">
				{tags.map(tag => (
					<li key={tag} value={tag}>
						<span>{tag}</span>
						<a onClick={() => onRemove(tag)}>
							<i className="bi bi-x-circle-fill"></i>
						</a>
					</li>
				))}
			</ul>

			<datalist id="tagList">
				{[...suggestions].map(tag => (
					<option key={tag} value={tag} />
				))}
			</datalist>

            <div className="input-group">
                <input
                    id="tags"
                    type="text"
                    placeholder="Tags"
                    className="form-control"
                    list="tagList"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="btn"
                    onClick={handleAddTag}
                >
                    <i className="bi bi-plus-lg" ></i>
                </button>
            </div>
		</>
	);
}

export default NoteForm;
