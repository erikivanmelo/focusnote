import { useState, useEffect, ReactNode } from "react";
import { Modal, Form, ListGroup, Button } from "react-bootstrap";
import "../styles/global.scss";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@renderer/routes/routesConfig";
import Note from "../models/Note";
import noteService from "@renderer/services/noteService";
import ColorSelector from "./ColorSelector";
import TagInput from "./TagInput";
import Color from "@renderer/models/Color";
import {useGenericQueryNoParams} from "@renderer/hooks/useGenericQuery";

// Extender la interfaz CSSProperties para incluir propiedades de WebKit
declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
  }
}

// Usar type assertion para evitar conflictos con las definiciones de tipos de Electron
const electronWindow = window as unknown as {
    electron?: {
        window: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
            isMaximized: () => Promise<boolean>;
            onMaximized: (callback: (isMaximized: boolean) => void) => void;
        };
    };
};


interface Props {
    children: ReactNode;
}

interface SearchFilters {
    title: string;
    content: string;
}

function Menu({ children }: Props) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [isMaximized, setIsMaximized] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const navigate = useNavigate();

    // Handle window controls
    useEffect(() => {
        if (!electronWindow.electron?.window) return;
        const { window: win } = electronWindow.electron;

        const checkMaximized = async () => {
            try {
                const maximized = await win.isMaximized();
                setIsMaximized(maximized);
            } catch (error) {
                console.error('Error checking window state:', error);
            }
        };

        checkMaximized();
        const handleMaximized = (isMax: boolean) => setIsMaximized(isMax);
        win.onMaximized(handleMaximized);
    }, []);

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
        {
            id: 'notes',
            icon: 'plus-lg',
            title: 'New note',
            onClick: () => navigate(ROUTES.NOTE_CREATE)
        },
        {
            id: 'search',
            icon: 'search',
            title: 'Search',
            onClick: () => setShowSearch(!showSearch)
        },
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
        <div className="menu-container">
            {/* Title Bar */}
            <div className="title-bar">
                <div className="title-bar-content">
                    <span>FocusNote</span>
                </div>

                <div className="window-controls">
                    <button
                        className="window-btn"
                        onClick={() => electronWindow.electron?.window.minimize()}
                        title="Minimize"
                    >
                        <i className="bi bi-dash"></i>
                    </button>
                    <button
                        className="window-btn"
                        onClick={() => electronWindow.electron?.window.maximize()}
                        title={isMaximized ? "Restore" : "Maximize"}
                    >
                        <i className={`bi ${isMaximized ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                    </button>
                    <button
                        className="window-btn"
                        onClick={() => electronWindow.electron?.window.close()}
                        title="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>

            <div className="menu-content">
                {/* Sidebar */}
                <div className="sidebar">
                    {sidebarButtons.map((btn) => (
                        <button
                            key={btn.id}
                            className={`sidebar-btn ${showSearch && btn.id === 'search' ? 'active' : ''}`}
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
                </div>

                {/* Search Sidebar */}
                <div className="search-sidebar" style={{display: (showSearch? "block" : "none")}}>
                    <NoteFilter/>
                </div>

                {/* Main Content */}
                <div className={`main-content ${showSearch ? 'with-search' : ''}`}>
                    <div className="row justify-content-center notes-container">
                        <main className="col-lg-8">
                            {children}
                        </main>
                    </div>
                </div>
            </div>

            {/* About Modal */}
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>About</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>FocusNote</b> is a minimalistic web application designed for quick and simple note-taking.</p>
                    <p>Inspired by the simplicity of platforms like Twitter, FocusNote allows users to record notes, track project progress, and document learnings.</p>
                </Modal.Body>
            </Modal>
        </div>
    );
}

//interface NoteFilterProps

function NoteFilter() {

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [selectedTags , setSelectedTags ] = useState<string[]>([]);

    const { data: searchResults, isLoading} = useGenericQueryNoParams(["notes"], noteService.getAll);

    const handleRemoveTag = (name: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== name));
    };

    const handleAddTag = (newTag: string) => {
        if (selectedTags.includes(newTag))
            return false;

        setSelectedTags([...selectedTags, newTag]);
        return true;
    };

    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    return(
        <>
        <Form className="search-form">
            <div className="d-flex gap-2">
                <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    size="sm"
                >
                    <i className={`bi bi-${showAdvanced ? 'chevron-up' : 'chevron-down'}`} />
                </Button>
                <Form.Control
                    type="search"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Search by title..."
                    autoFocus
                    className="flex-grow-1"
                />
                <Button
                    variant="outline-secondary"
                    type="button"
                    size="sm"
                >
                    <i className={`bi bi-arrow-return-left`} />
                </Button>
            </div>

            {showAdvanced && (
                <div className="mt-1">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Search by content..."
                        className="mb-2"
                    />
                    <TagInput
                        tags={selectedTags}
                        onSubmit={handleAddTag}
                        onRemove={handleRemoveTag}
                    />

                    <div className="d-flex gap-2 mb-2 mt-3">
                        <div className="color-slider-container">
                            <ColorSelector
                                value={selectedColor}
                                onChange={setSelectedColor}
                            />
                        </div>

                        <Button
                            variant="outline-secondary"
                            onClick={() => setSelectedColor(null)}
                            size="sm"
                            title="Clear filters"
                        >
                            <i className="bi bi-x-lg" />
                        </Button>
                    </div>
                </div>
            )}
        </Form>

        <div className="search-results">
            {searchResults && searchResults.length > 0 ? (
                <ListGroup className="">
                    {searchResults.map((note: Note) => (
                        <ListGroup.Item
                            key={note.id}
                            action
                            //onClick={() => navigateToNote(note.id)}
                            className={"search-result-item " + note.color.name}
                        >
                            <div className="fw-bold">{note.title || 'Untitled Note'}</div>
                            <div className="text-muted small">
                                {note.content && note.content.substring(0, 100)}{note.content && note.content.length > 100 ? '...' : ''}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <div className="text-center text-muted">
                <hr/>
                    {isLoading ? 'Searching...' : 'No results found'}
                </div>
            )}
        </div>
        </>
    )
}

export default Menu;

