import React, { useState } from "react";

export interface OptionMenuItemProps {
    onClick ?: () => void;
    children : React.ReactNode;
}

export function OptionMenuItem({ onClick, children }: OptionMenuItemProps) {
    return (
        <li>
            <a onClick={onClick}>{children}</a>
        </li>
    )
};

export interface OptionMenuProps {
    children  : React.ReactNode;
    className?: string;
}

export function OptionMenu ({ children, className }: OptionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={"optionMenu " + className}>
            <span
                className="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                tabIndex={0}
                onClick={() => setIsOpen(open => !open)}
                onBlur={() => setIsOpen(false)}
            />
            {isOpen && (
                <ul tabIndex={-1} onMouseDown={e => e.preventDefault()}>
                    {children}
                </ul>
            )}
        </div>
    );
};

export default OptionMenu;
