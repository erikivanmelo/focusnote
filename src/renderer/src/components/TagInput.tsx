import {useGenericQueryNoParams} from "@renderer/hooks/useGenericQuery";
import tagService from "@renderer/services/tagService";
import {useCallback, useMemo, useState} from "react";

interface TagInputProps {
	tags    ?: string[];
	onSubmit?: (tag: string) => boolean;
	onRemove?: (tag: string) => void;
}

function TagInput({
    tags = [],
    onSubmit = () => {return false},
    onRemove = () => {}
}: TagInputProps) {
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
export default TagInput;
