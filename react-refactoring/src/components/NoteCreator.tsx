import React, { useRef, useState } from "react";

interface Props {
    autocompleteTagList?: Array<string>;
}

const NoteCreator: React.FC<Props> = ({ autocompleteTagList = [] }) => {
    const [localAutocompleteTagList, setLocalAutocompleteTagList] = useState<Array<string>>(autocompleteTagList);
    const [tags, setTags] = useState<Array<string>>([]);
    const inputTagRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputTagRef.current) return;
        const value = inputTagRef.current.value.trim();
        if (event.key === "Enter" && value) {
            if (!tags.includes(value)) {
                addTag(value);
                inputTagRef.current.value = "";
            }
        }
    };

    const addTag = (newTag: string) => {
        setLocalAutocompleteTagList(localAutocompleteTagList.filter((value) => newTag !== value));
        setTags([...tags, newTag]);
    };

    const removeTag = (name: string) => {
        if (autocompleteTagList.includes(name)) {
            setLocalAutocompleteTagList([...localAutocompleteTagList, name]);
        }
        setTags(tags.filter((tag) => tag !== name));
    };

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
                    <TagList tags={tags} onRemove={removeTag} />
                    <TagInput
                        inputRef={inputTagRef}
                        onKeyDown={handleKeyDown}
                        autocompleteList={localAutocompleteTagList}
                    />
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
    inputRef: React.RefObject<HTMLInputElement>;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    autocompleteList: Array<string>;
}
function TagInput({ inputRef, onKeyDown, autocompleteList }: TagInputProps) {
    return (
        <>
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
                onKeyDown={onKeyDown}
            />
        </>
    );
}

export default NoteCreator;
