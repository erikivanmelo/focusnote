import { useGenericQueryNoParams } from "@renderer/hooks/useGenericQuery";
import tagService from "@renderer/services/tagService";
import { useEffect, useRef, useState } from "react";
import './TagInput.scss';

interface TagInputProps {
    tags         : string[];
    onSubmit     : (tag: string) => boolean;
    onRemove     : (tag: string) => void;
    onlyExisting?: boolean;
}

function TagInput({ tags, onSubmit, onRemove, onlyExisting = false }: TagInputProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [showPopover, setShowPopover] = useState(false);

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
                // Don't close the popover
            }
        }
    };

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            // Don't close if clicking on the popover or the button
            if (popoverRef.current?.contains(target) || buttonRef.current?.contains(target)) {
                return;
            }

            // Don't close if clicking on tag chips or remove buttons
            const isTagChip = (target as Element)?.closest?.('.badge');
            const isTagRemoveButton = (target as Element)?.closest?.('.btn-close');
            if (isTagChip || isTagRemoveButton) {
                return;
            }

            setShowPopover(false);
        };
        if (showPopover) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPopover]);

    return (
        <div className="tag-input-container" ref={containerRef}>
            {/* Tag chips and button in the same flex container */}
            <div className="tags d-flex flex-wrap gap-1 mb-0" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
                {/* + button as first item */}
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                        ref={buttonRef}
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: 28, height: 28, padding: 0 }}
                        onClick={() => setShowPopover(true)}
                        aria-label="Add tag"
                    >
                        <i className="bi bi-plus" />
                    </button>

                    {/* Floating popover always above */}
                    {showPopover && (
                        <div
                            className="tag-suggestions popover popover--above"
                            ref={popoverRef}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className="fw-bold">Tag note</span>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white btn-sm"
                                    aria-label="Close"
                                    onClick={() => setShowPopover(false)}
                                />
                            </div>
                            <input
                                type="text"
                                value={inputValue}
                                maxLength={40}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && inputValue.trim()) {
                                        handleSubmit(inputValue.trim());
                                    } else if (e.key === 'Escape') {
                                        setShowPopover(false);
                                    }
                                }}
                                autoFocus
                                placeholder="Enter a tag name"
                                className="form-control mb-2 popover-input"
                            />
                            {/* Suggestions without checkboxes */}
                            <div className="suggestions-container">
                                {filteredTags.length > 0 && (
                                    filteredTags.map(tag => (
                                        <div
                                            key={tag}
                                            className="suggestion-item"
                                            onClick={() => handleSubmit(tag)}
                                        >
                                            <i className="bi bi-tag suggestion-icon"></i>
                                            {tag}
                                        </div>
                                    ))
                                )}

                                {/* Show create button only if there are no exact matches */}
                                {inputValue.trim() &&
                                 !allTags.includes(inputValue.trim()) &&
                                 !tags.includes(inputValue.trim()) &&
                                 !filteredTags.some(tag => tag.toLowerCase() === inputValue.trim().toLowerCase()) && (
                                    <div
                                        className="suggestion-item suggestion-item--create"
                                        onClick={() => handleSubmit(inputValue.trim())}
                                    >
                                        <i className="bi bi-plus-circle"></i>
                                        Create tag "{inputValue.trim()}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tag chips */}
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
