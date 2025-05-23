import React, { useRef, useState, useEffect} from "react";
import { useGenericQueryNoParams } from "../hooks/useGenericQuery";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import noteService from '../services/noteService';
import colorService from "../services/colorService";
import tagService from "../services/tagService";
import Note from "../models/Note";
import Tag from "../models/Tag";
import Color from "../models/Color";

function NoteCreator() {

    const {data: initialAutocompleteTagList} = useGenericQueryNoParams(["tags"], tagService.getAllNames)
    const [autocompleteTagList , setAutocompleteTagList] = useState<string[]>(initialAutocompleteTagList??[])
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { data: colors } = useGenericQueryNoParams(["colors"], colorService.getAll);
    const [selectedColor, setSelectedColor] = useState<Color>(colors?.find((color) => color.isDefault)?? new Color(1, "light", true));

    const createNoteMutation = useInvalidateMutation(noteService.create, ["notes", "note"]);

    const contentRef = useRef<HTMLTextAreaElement>(null);
    const titleRef   = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (createNoteMutation.isSuccess) {
            if (contentRef.current)
                contentRef.current.value = "";
            if (titleRef.current)
                titleRef.current.value = ""
            setSelectedTags([]);
            setSelectedColor(new Color(1, "light", true))
        }

    }, [createNoteMutation.isSuccess])

    const publish = () => {
        const newNote = new Note(
            -1,
            titleRef.current?.value?? "",
            contentRef.current?.value?? "",
            selectedColor,
            selectedTags.map((tagName) => new Tag(-1, tagName))
        );
        createNoteMutation.mutate(newNote)
    }

    const removeTag = (name: string) => {
        if (autocompleteTagList.includes(name)) {
            setAutocompleteTagList([...autocompleteTagList, name]);
        }
        setSelectedTags(selectedTags.filter((tag) => tag !== name));
    };

    const addTag = (newTag: string) => {
        if (selectedTags.includes(newTag))
            return false;

        setAutocompleteTagList(autocompleteTagList.filter((value) => newTag !== value));
        setSelectedTags([...selectedTags, newTag]);
        return true;
    };

    return (
        <div className="card mb-3 shadow">
            <div className="card-body">
                <div className="card-text">
                    <ColorSelector value={selectedColor} colors={colors} onSelect={setSelectedColor} />
                    <hr />
                    <input ref={titleRef} id="title" type="text" placeholder="Title" className="form-control mb-2" />
                    <textarea
                        id="content"
                        className="form-control mb-2"
                        placeholder="What do you have to tell today?"
                        ref={contentRef}
                    ></textarea>
                    <TagList tags={selectedTags} onRemove={removeTag} />
                    <TagInput autocompleteList={autocompleteTagList} onSubmit={addTag} />
                </div>
            </div>
            <div className="card-footer">
                <button className="btn btn-primary rounded-pill float-end" onClick={publish}>Publish</button>
            </div>
        </div>
    );
};


interface ColorSelectorProps {
    value: Color;
    colors: Color[];
    onSelect: (color: Color) => void;
}

function ColorSelector({ value, colors, onSelect }: ColorSelectorProps) {
    return (
        <div className="d-flex flex-wrap mb-2 justify-content-center">
            {colors?.map((color: Color) => (
                <label key={color.id}>
                    <input 
                        type="radio" 
                        name="color" 
                        value={color.name} 
                        checked={color.id === value.id} 
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
    onSubmit: (tags: string) => boolean; 
}
function TagInput({ autocompleteList, onSubmit }: TagInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputRef.current) return;
        const value = inputRef.current.value.trim();
        if (event.key === "Enter" && value) {
            if (onSubmit(inputRef.current.value))
                inputRef.current.value = "";
        }
    };

    return (
        <>
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
