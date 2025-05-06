import React, { useEffect, useRef, useState } from "react";

interface Props {
    id: number;
    color  ?: string;
    title  ?: string;
    tags   ?: Array<string>;
    datetime: Date;
    children: React.ReactNode;
}

function Card({ 
        id, 
        color = "light", 
        title,
        tags = [],
        datetime, 
        children
}: Props) {
    return (
        <div className={`card mb-3 shadow mt-4 bc-callout card-${color}`}>
            <div className="card-body">
                <Header id={id} datetime={datetime} />
                <Title>{title}</Title>
                <Content>{children}</Content>
                <Tags tags={tags}/>
            </div>
        </div>
    );
}

interface HeaderProps {
    id: number;
    datetime: Date;
}

function Header({ id, datetime }: HeaderProps) {
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

    const date = datetime.toLocaleDateString();
    const time = datetime.toLocaleTimeString();
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

interface TagsProps {
    tags: Array<string>;
}

function Tags({ tags }: TagsProps) {
    return (
        <div className="tags">
            {tags.map((tag) => (
                <a href="#">#{tag}</a>
            ))}
        </div>
    )
}

export default Card;
