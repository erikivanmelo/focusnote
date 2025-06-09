import { ROUTES } from "@renderer/routes/routesConfig";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Menu() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const navigate = useNavigate();

    // Toggle dark/light theme
    const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
        if (newDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    // Set initial theme on component mount
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);


    return (
        <div>
            {/* Top Navigation */}
            <nav className="top-navbar">
                <div className="app-title">FocusNote</div>
                <div className="nav-actions">
                    <button
                        className="nav-action"
                        onClick={() => setIsModalOpen(true)}
                        title="About"
                    >
                        <i className="bi bi-info-circle"></i>
                    </button>
                    <button
                        className="nav-action"
                        onClick={toggleTheme}
                        title={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                    >
                        <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`}></i>
                    </button>
                    <button
                        className="nav-action"
                        onClick={() => navigate(ROUTES.NOTE_CREATE)}
                        title="New Note"
                    >
                        <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
            </nav>

            {/* About Modal */}
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>About</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <b>FocusNote</b> is a minimalistic web application designed for quick and
                        simple note-taking. Inspired by the simplicity of platforms like Twitter,
                        FocusNote allows users to record notes, track project progress, and document
                        learnings related to the world of software—all within a clean and focused
                        interface.
                    </p>
                    <p>
                        This project was initially created as a personal tool to organize ideas and
                        keep a daily log of studies and projects. What started as a hobby has evolved
                        into a practical way to maintain a history of knowledge and tasks.
                    </p>
                    <p>
                        FocusNote prioritizes simplicity and ease of use, making it the perfect
                        solution for those seeking a lightweight and efficient method to manage their
                        notes.
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Menu;
