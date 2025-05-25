import React, { useState } from "react";
import Note from "../models/Note";
import Tag from "../models/Tag";
import noteService from "../services/noteService";
import { useInvalidateMutation } from "../hooks/useInvalidateMutation";

interface Props {
    note: Note;
}

function NoteCard({ note }: Props) {
    const deleteNoteMutation = useInvalidateMutation("notes", noteService.delete);

    const handleDeleteNote = async (noteId: number) => {
        deleteNoteMutation.mutate(noteId);
    };


    return (
        <div className={`card mb-3 shadow mt-4 bc-callout card-${note.color.name}`}>
            <div className="card-body">
                <Header id={note.id} created_at={note.createdAt} onDelete={handleDeleteNote} />
                <Title>{note.title}</Title>
                <Content>{note.content}</Content>
                <Tags tags={note.tags} />
            </div>
        </div>
    );
}

interface HeaderProps {
    id: number;
    created_at: Date | null;
    onDelete: (noteId: number) => void;
}

function Header({ id, created_at, onDelete }: HeaderProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const date = created_at?.toLocaleDateString()?? "00/00/00";
    const time = created_at?.toLocaleTimeString()?? "00:00:00";

    return (
        <div className="text-body-secondary mb-2">
            <small>
                <b>#{id}</b> Published on {date} at {time}
            </small>
            <div className="optionMenu float-end">
                <span 
                    className="button" 
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    tabIndex={0}
                    onClick={() => setIsOpen(open => !open)} 
                    onBlur={() => setIsOpen(false)}
                ></span>
                {isOpen && (
                    <ul 
                        tabIndex={-1} 
                        onMouseDown={e => e.preventDefault()}
                    >
                        <li>
                            <a onClick={() => onDelete(id)}>Delete</a>
                        </li>
                        <li>
                            <a>Edit</a>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}

interface TitleProps {
    children: React.ReactNode;
}

function Title({ children }: TitleProps) {
    if (children?.toString() == "" )
        return;

    return (
        <div className="card-title row">
            <span className="h4 col-11">{children}</span>
        </div>
    );
}

interface ContentProps {
    children: React.ReactNode;
}

function Content({ children }: ContentProps) {
    return <p className="text-body">{children}</p>;
}

interface TagsProps {
    tags: Array<Tag>;
}

function Tags({ tags }: TagsProps) {
    return (
        <div className="tags">
            {tags.map((tag) => (
                <a key={tag.id} href="#">
                    #{tag.name}
                </a>
            ))}
        </div>
    );
}

export default NoteCard;
