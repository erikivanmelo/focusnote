import React, { useCallback, useState, useEffect, useMemo} from "react";
import { useGenericQueryNoParams } from "../hooks/useGenericQuery";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";
import noteService from '../services/noteService';
import colorService from "../services/colorService";
import tagService from "../services/tagService";
import Note from "../models/Note";
import Tag from "../models/Tag";
import Color from "../models/Color";
import DisableLayer from "./DisableLayer";

function NoteCreator() {
    const defaultColor = useMemo(() => new Color(1, "light", true), []);

    const createNoteMutation = useInvalidateMutation(["notes", "note"], noteService.create);

    //Inputs
    const [selectedColor, setSelectedColor] = useState<Color   >(defaultColor);
    const [title        , setTitle        ] = useState<string  >("");
    const [content      , setContent      ] = useState<string  >("");
    const [selectedTags , setSelectedTags ] = useState<string[]>([]);

    useEffect(() => {
        if (createNoteMutation.isSuccess){
            setContent      ("");
            setTitle        ("");
            setSelectedTags ([]);
            setSelectedColor(defaultColor)
        }
    }, [
        createNoteMutation.isSuccess,
        defaultColor
    ]);

    const publish = () => {
        const newNote = new Note(
            -1,
            title,
            content,
            selectedColor,
            selectedTags.map((tagName) => new Tag(-1, tagName))
        );
        createNoteMutation.mutate(newNote)
    }

    const handleRemoveTag = (name: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== name));
    };

    const handleAddTag = (newTag: string) => {
        if (selectedTags.includes(newTag))
            return false;

        setSelectedTags([...selectedTags, newTag]);
        return true;
    };

    return (
        <div className="card mb-3 shadow form-wrapper disabled">
            <div className="card-body">
                <div className="card-text" style={createNoteMutation.isPending? {  "filter": "blur(4px)" } : {}}>
                    <ColorSelector 
                        value={selectedColor} 
                        onChange={setSelectedColor}
                    />
                    <hr />

                    {/* Title Input */}
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        id="title" 
                        type="text" 
                        placeholder="Title" 
                        className="form-control mb-2" 
                    />

                    {/* Content Input */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        id="content"
                        className="form-control mb-2"
                        placeholder="What do you have to tell today?"
                    ></textarea>

                    <TagInput 
                        tags={selectedTags}
                        onSubmit={handleAddTag}
                        onRemove={handleRemoveTag}
                    />
                </div>
            </div>
            <div className="card-footer">
                { createNoteMutation.isPending &&
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

                <button className="btn btn-primary rounded-pill float-end" onClick={publish}>Publish</button>
            </div>
            <DisableLayer disabled={createNoteMutation.isPending} />
        </div>
    );
};


interface ColorSelectorProps {
    value   : Color;
    onChange: (color: Color) => void;
}

function ColorSelector({ value, onChange }: ColorSelectorProps) {
    const {data: colors} = useGenericQueryNoParams<Array<Color >>(["colors"], colorService.getAll   );

    return (
        <div className="d-flex flex-wrap mb-2 justify-content-center">
            {colors?.map((color: Color) => (
                <label key={color.id}>
                    <input 
                        type="radio" 
                        name="color" 
                        value={color.name} 
                        checked={color.id === value.id} 
                        onChange={() => onChange?.(color)}
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

export default NoteCreator;
