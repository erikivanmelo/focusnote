import { useState, useEffect, ReactNode } from "react";
import { Modal, Form, ListGroup, Button } from "react-bootstrap";
import "../styles/global.scss";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@renderer/routes/routesConfig";
import Note from "../models/Note";
import noteService from "@renderer/services/noteService";

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
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [filters, setFilters] = useState<SearchFilters>({
        title: '',
        content: ''
    });

    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
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

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle search submission
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!filters.title && !filters.content) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const allNotes = await noteService.getAll();
            const filteredNotes = allNotes.filter(note => {
                const titleMatch = !filters.title ||
                    (note.title && note.title.toLowerCase().includes(filters.title.toLowerCase()));
                const contentMatch = !filters.content ||
                    (note.content && note.content.toLowerCase().includes(filters.content.toLowerCase()));
                return titleMatch && contentMatch;
            });
            setSearchResults(filteredNotes);
        } catch (error) {
            console.error('Error searching notes:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Navigate to note
    const navigateToNote = (noteId: number) => {
        navigate(`/notes/edit/${noteId}`);
        setShowSearch(false);
    };

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
                {showSearch && (
                    <div className="search-sidebar">
                        <Form onSubmit={handleSearch}>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="search"
                                    name="title"
                                    value={filters.title}
                                    //onChange={handleFilterChange}
                                    placeholder="Search notes..."
                                    autoFocus
                                    className="flex-grow-1"
                                />
                                <Button
                                    variant="outline-secondary"
                                    type="button"
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    size="sm"
                                    title="Advanced search"
                                >
                                    <i className={`bi bi-${showAdvanced ? 'chevron-up' : 'chevron-down'}`} />
                                </Button>
                            </div>

                            {showAdvanced && (
                                <div className="mt-3">
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="content"
                                        value={filters.content}
                                        //onChange={handleFilterChange}
                                        placeholder="Search in content..."
                                        className="mb-2"
                                    />

                                    <div className="d-flex gap-2 mb-2">
                                        <div className="color-slider-container">
                                            <input
                                                type="range"
                                                min="0"
                                                //max={colorOptions.length - 1}
                                                //value={colorValues.indexOf(filters.color) >= 0 ? colorValues.indexOf(filters.color) : 0}
                                                //onChange={handleSliderChange}
                                                className="color-slider"
                                                list="color-markers"
                                            />
                                            <div className="color-legend">
                                                {/*colorOptions.map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className={`color-marker ${filters.color === color.value ? 'active' : ''}`}
                                                        style={{ '--color': color.color } as React.CSSProperties}
                                                        onClick={() => {
                                                            //setSliderValue(index);
                                                            setFilters(prev => ({ ...prev, color: color.value }));
                                                        }}
                                                        title={color.label}
                                                    >
                                                        {!color.value && (
                                                            <i className="bi bi-x"></i>
                                                        )}
                                                    </div>
                                                    ))*/}
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline-secondary"
                                            //onClick={clearFilters}
                                            size="sm"
                                            title="Clear filters"
                                        >
                                            <i className="bi bi-x-lg" />
                                        </Button>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Form.Control
                                            type="text"
                                            //value={tagInput}
                                            //onChange={(e) => setTagInput(e.target.value)}
                                            //onKeyDown={handleAddTag}
                                            placeholder="Add tags (Enter to add)"
                                            size="sm"
                                            className="flex-grow-1"
                                        />
                                    </div>

                                    {/*filters.tags && (
                                        <div className="tags-container mt-2">
                                            {filters.tags.map(tag => (
                                                <span key={tag} className="tag">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        className="tag-remove"
                                                        //onClick={() => removeTag(tag)}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        )*/}
                                </div>
                            )}
                        </Form>

                        <div className="search-results mt-3">
                            {searchResults.length > 0 ? (
                                <ListGroup>
                                    {searchResults.map(note => (
                                        <ListGroup.Item
                                            key={note.id}
                                            action
                                            onClick={() => navigateToNote(note.id)}
                                            className="search-result-item"
                                        >
                                            <div className="fw-bold">{note.title || 'Untitled Note'}</div>
                                            <div className="text-muted small">
                                                {note.content && note.content.substring(0, 100)}{note.content && note.content.length > 100 ? '...' : ''}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <div className="text-center text-muted py-3">
                                <hr/>
                                    {isSearching ? 'Searching...' : 'No results found'}
                                </div>
                            )}
                        </div>
                    </div>
                )}

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

export default Menu;

