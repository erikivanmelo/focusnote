import { useState, useEffect, ReactNode } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@renderer/routes/routesConfig";
import './Menu.scss'

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
        { id: 'notes', icon: 'plus-lg', title: 'New note', onClick: () => navigate(ROUTES.NOTE_CREATE) },
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
                </div>

                {/* Main Content */}
                <div className="main-content">
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
