import { useState, useEffect} from "react";
import './SideBar.scss'
import NoteCard from "@renderer/components/NoteCard/NoteCard";

// Extender la interfaz CSSProperties para incluir propiedades de WebKit
declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

function SideBar() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [showNoteForm, setShowNoteForm] = useState<boolean>(false);

    // Toggle dark/light theme
    const toggleTheme = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.body.classList.toggle('dark', newDarkMode);
    };

    // Set initial theme
    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const sidebarButtons = [
        { id: 'notes', icon: 'plus-lg', title: 'New note', onClick: () => {setShowNoteForm(true)} },
        //{ id: 'search', icon: 'search', title: 'Search' },
    ];

    const actionButtons = [
        {
            id: 'theme',
            icon: isDarkMode ? 'sun' : 'moon',
            title: isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme',
            onClick: toggleTheme
        },
    ];

    return (
        <div className="sidebar">
            {sidebarButtons.map((btn) => (
                <button
                    key={btn.id}
                    className="sidebar-btn"
                    onClick={btn.onClick}
                    title={btn.title}
                >
                    <i className={`bi bi-${btn.icon}`}></i>
                </button>
            ))}

            <div className="action-buttons">
                {actionButtons.map((btn) => (
                    <button
                        key={btn.id}
                        className="action-btn"
                        onClick={btn.onClick}
                        title={btn.title}
                    >
                        <i className={`bi bi-${btn.icon}`}></i>
                    </button>
                ))}
            </div>
            { showNoteForm &&
                <NoteCard
                    isModal={true}
                    mode='create'
                    onModalClose={() => {setShowNoteForm(false)}}
                />
            }
        </div>

    );
}

export default SideBar;
