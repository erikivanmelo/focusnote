import React, { useRef, useState, useEffect } from "react";

interface Props {
    autocompleteTagList?: Array<string>;
}

function NoteCreator({ autocompleteTagList = [] }: Props) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    return (
        <div className="card mb-3 shadow">
            <div className="card-body">
                <div className="card-text">
                    <ColorSelector />
                    <hr />
                    <input id="title" type="text" placeholder="Title" className="form-control mb-2" />
                    <textarea
                        id="content"
                        className="form-control mb-2"
                        placeholder="What do you have to tell today?"
                    ></textarea>
                    <TagInput autocompleteList={autocompleteTagList} onChange={setSelectedTags} />
                </div>
            </div>
            <div className="card-footer">
                <button className="btn btn-primary rounded-pill float-end">Publish</button>
            </div>
        </div>
    );
};


function ColorSelector() {

    const colors = ["light", "pink", "red", "orange", "yellow", "green", "blue", "purple"];

    return (
        <div className="d-flex flex-wrap mb-2 justify-content-center">
            {colors.map((color) => (
                <label key={color}>
                    <input value={color} defaultChecked={color === "light"} type="radio" name="color" />
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
            {tags.map((tag) => (
                <li key={tag} value={tag}>
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
                {autocompleteList.map((tag) => (
                    <option key={tag} value={tag}></option>
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
