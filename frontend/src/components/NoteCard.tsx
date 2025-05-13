import React, { useEffect, useRef, useState } from "react";
import Note from "../models/Note";
import Tag from "../models/Tag";

interface Props {
    note: Note
}

function NoteCard({note}: Props) {
    return (
        <div className={`card mb-3 shadow mt-4 bc-callout card-${note.color.name}`}>
            <div className="card-body">
                <Header id={note.id} created_at={note.createdAt} />
                <Title>{note.title}</Title>
                <Content>{note.content}</Content>
                <TagPills tags={note.tags}/>
            </div>
        </div>
    );
}

interface HeaderProps {
    id: number;
    created_at: Date;
}

function Header({ id, created_at }: HeaderProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
            setIsOpen(false);        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const date = created_at.toLocaleDateString();
    const time = created_at.toLocaleTimeString();
    return (
        <div className="text-body-secondary mb-2">
            <small>
                <b>#{id}</b> Published on {date} at {time}
            </small>
            <div className="optionMenu float-end" >
                <span  ref={buttonRef} className="button" onClick={() => setIsOpen(!isOpen)} ></span>
                {isOpen && (
                    <ul >
                        <li><a>Delete</a></li>
                        <li><a>Edit</a></li>
                    </ul>
                )}
            </div>
        </div>
    )
}

interface TitleProps {
    children: React.ReactNode;
}

function Title({ children }: TitleProps) {
    return (
        <div className="card-title">
            <div className="row">
                <span className="h4 col-11">
                    {children}
                </span>
            </div>
        </div>
    )
}

interface ContentProps {
    children: React.ReactNode;
}

function Content({ children }: ContentProps) {
    return (
        <>
            <p className="text-body">
                {children}
            </p>
        </>
    )
}

interface TagPillsProps {
    tags: Array<Tag>;
}

function TagPills({ tags }: TagPillsProps) {
    return (
        <div className="tags">
            {tags.map((tag) => (
                <a key = {tag.id} href="#">#{tag.name}</a>
            ))}
        </div>
    )
}

export default NoteCard;
