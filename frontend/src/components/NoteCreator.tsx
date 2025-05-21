import React, { useRef, useState, useEffect} from "react";
//import useFetch from '../hooks/useFetch';
import { useGenericQueryNoParams } from "../hooks/useGenericQuery";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import noteService from '../services/noteService';
import colorService from "../services/colorService";
import Note from "../models/Note";
import Tag from "../models/Tag";
import Color from "../models/Color";

interface Props {
    autocompleteTagList?: Array<string>;
}

function NoteCreator({ autocompleteTagList = [] }: Props) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedColor, setSelectedColor] = useState<Color>(new Color(1, "light"));

    const createNoteMutation = useInvalidateMutation(noteService.create, ["notes", "note"]);

    const contentRef = useRef<HTMLTextAreaElement>(null);
    const titleRef   = useRef<HTMLInputElement>(null);

    const publish = () => {
        const newNote = new Note(
            -1,
            titleRef.current?.value?? "",
            contentRef.current?.value?? "",
            selectedColor,
            selectedTags.map((tagName) => new Tag(-1, tagName))
        );
        createNoteMutation.mutate(newNote)
        //const { data: note, loading, error } = useFetch(noteService.create, newNote);
    }


    return (
        <div className="card mb-3 shadow">
            <div className="card-body">
                <div className="card-text">
                    <ColorSelector onSelect={setSelectedColor} />
                    <hr />
                    <input ref={titleRef} id="title" type="text" placeholder="Title" className="form-control mb-2" />
                    <textarea
                        id="content"
                        className="form-control mb-2"
                        placeholder="What do you have to tell today?"
                        ref={contentRef}
                    ></textarea>
                    <TagInput autocompleteList={autocompleteTagList} onChange={setSelectedTags} />
                </div>
            </div>
            <div className="card-footer">
                <button className="btn btn-primary rounded-pill float-end" onClick={publish}>Publish</button>
            </div>
        </div>
    );
};


interface ColorSelectorProps {
    onSelect: (color: Color) => void; // Asegúrate de que el tipo sea correcto
}

function ColorSelector({ onSelect }: ColorSelectorProps) {
    const { data: colors } = useGenericQueryNoParams(["colors"], colorService.getAll);

    return (
        <div className="d-flex flex-wrap mb-2 justify-content-center">
            {colors?.map((color: Color) => (
                <label key={color.id}>
                    <input 
                        type="radio" 
                        name="color" 
                        value={color.name} 
                        defaultChecked={color.name === "light"} 
                        onChange={() => onSelect?.(color)}
                    />
                    <span className="checkmark"></span>
                </label>
            ))}
        </div>
    );
}

interface TagListProps {
    tags: string[];
    onRemove: (tag: string) => void;
}
function TagList ({ tags, onRemove }: TagListProps) {
    return (
        <ul id="tag-pills">
            {tags.map((tag, index) => (
                <li key={index} value={tag}>
                    <span>{tag}</span>
                    <a onClick={() => onRemove(tag)}>
                        <i className="bi bi-x-circle-fill"></i>
                    </a>
                </li>
            ))}
        </ul>
    );
};

interface TagInputProps {
    autocompleteList: Array<string>;
    onChange: (tags: string[]) => void; 
}
function TagInput({ autocompleteList, onChange }: TagInputProps) {
    const [localAutocompleteTagList, setLocalAutocompleteTagList] = useState<Array<string>>(autocompleteList);
    const [tags, setTags] = useState<Array<string>>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        onChange?.(tags);
    }, [tags, onChange]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputRef.current) return;
        const value = inputRef.current.value.trim();
        if (event.key === "Enter" && value) {
            if (!tags.includes(value)) {
                addTag(value);
                inputRef.current.value = "";
            }
        }
    };

    const addTag = (newTag: string) => {
        setLocalAutocompleteTagList(localAutocompleteTagList.filter((value) => newTag !== value));
        setTags([...tags, newTag]);
    };

    const removeTag = (name: string) => {
        if (localAutocompleteTagList.includes(name)) {
            setLocalAutocompleteTagList([...localAutocompleteTagList, name]);
        }
        setTags(tags.filter((tag) => tag !== name));
    };

    return (
        <>
            <TagList tags={tags} onRemove={removeTag} />
            <datalist id="tagList">
                {autocompleteList.map((tag, index) => (
                    <option key={index} value={tag}></option>
                ))}
            </datalist>
            <input
                id="tags"
                type="text"
                placeholder="Tags"
                className="form-control"
                list="tagList"
                ref={inputRef}
                onKeyDown={handleKeyDown}
            />
        </>
    );
}

export default NoteCreator;
