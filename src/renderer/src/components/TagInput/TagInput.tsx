import { useGenericQueryNoParams } from "@renderer/hooks/useGenericQuery";
import tagService from "@renderer/services/tagService";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import './TagInput.scss';

interface TagInputProps {
    tags         : string[];
    onSubmit     : (tag: string) => boolean;
    onRemove     : (tag: string) => void;
    onlyExisting?: boolean;
}

function TagInput({ tags, onSubmit, onRemove, onlyExisting = false }: TagInputProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { data: allTags = [] } = useGenericQueryNoParams<string[]>(
        ["tags"],
        tagService.getAllNamesInUse
    );

    const filteredTags = allTags.filter(tag =>
        !tags.includes(tag) &&
        tag.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleSubmit = (tag: string) => {
        if ((!onlyExisting || allTags.includes(tag)) && !tags.includes(tag)) {
            if (onSubmit(tag)) {
                setInputValue('');
                setShowSuggestions(false);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="tag-selector mb-3" ref={containerRef}>

            <div className="position-relative">
                <Form.Control
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputValue.trim()) {
                            handleSubmit(inputValue.trim());
                        } else if (e.key === 'Escape') {
                            setShowSuggestions(false);
                        }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onClick={() => setShowSuggestions(true)}
                    placeholder="Tags"
                    className="mb-0"
                />

                {showSuggestions && filteredTags.length > 0 && (
                    <div className="tag-suggestions position-absolute w-100 bg-white border rounded shadow-sm mt-1">
                        {filteredTags.map(tag => (
                            <div
                                key={tag}
                                className="suggestion-item p-2 hover-bg-light cursor-pointer"
                                onClick={() => handleSubmit(tag)}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="selected-tags d-flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                    <span key={tag} className="badge bg-primary d-flex align-items-center">
                        <i className="bi bi-tag"></i>
                        {tag}
                        <button
                            type="button"
                            className="btn-close btn-close-white btn-sm ms-1"
                            onClick={() => onRemove(tag)}
                            aria-label={`Remove ${tag}`}
                        />
                    </span>
                ))}
            </div>

        </div>
    );
}

export default TagInput;
