import { ROUTES } from "@renderer/routes/routesConfig";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/global.scss";

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

function Menu() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const navigate = useNavigate();

  // Efecto para manejar el estado de maximizado
  useEffect(() => {
    // Verificar si estamos en el entorno de Electron
    if (!electronWindow.electron?.window) return;
    const { window: win } = electronWindow.electron;

    // Función para verificar el estado actual de la ventana
    const checkMaximized = async () => {
      try {
        const maximized = await win.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        console.error('Error checking window state:', error);
      }
    };

    // Verificar el estado inicial
    checkMaximized();

    // Función para manejar cambios en el estado de maximizado
    const handleMaximized = (isMax: boolean) => {
      setIsMaximized(isMax);
    };

    // Configurar el listener para cambios de estado
    win.onMaximized(handleMaximized);
  }, []);

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
  <>
    <nav className="custom-title-bar d-flex align-items-center justify-content-between px-3" style={{ WebkitAppRegion: 'drag', padding: '0.5rem 1rem' }}>
      {/* Izquierda: acciones propias de la app */}
      <div className="menu-actions d-flex align-items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          className="nav-action btn btn-link p-1"
          onClick={() => setIsModalOpen(true)}
          title="About"
        >
          <i className="bi bi-info-circle" style={{ fontSize: '1.1rem' }}></i>
        </button>
        <button
          className="nav-action btn btn-link p-1"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'}`} style={{ fontSize: '1.1rem' }}></i>
        </button>
        <button
          className="nav-action btn btn-link p-1"
          onClick={() => navigate(ROUTES.NOTE_CREATE)}
          title="New Note"
        >
          <i className="bi bi-plus-lg" style={{ fontSize: '1.1rem' }}></i>
        </button>
        {/* Separador visual */}
        <span className="menu-divider mx-3" style={{ borderLeft: '1.5px solid #ccc', height: 24, display: 'inline-block', opacity: 0.5 }} />
      </div>

      {/* Centro: título */}
      <div className="title-bar-title flex-grow-1 text-center" style={{ 
        fontWeight: 500, 
        fontSize: '1.1rem', 
        letterSpacing: '0.03em',
        WebkitAppRegion: 'drag',
        cursor: 'default'
      }}>
        FocusNote
      </div>

      {/* Derecha: botones de ventana */}
      <div className="title-bar-buttons d-flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <Button
          variant="light"
          size="sm"
          className="title-bar-btn"
          style={{ minWidth: 32 }}
          onClick={() => electronWindow.electron?.window.minimize()}
          aria-label="Minimizar"
        >
          <span aria-hidden>–</span>
        </Button>
        <Button
          variant="light"
          size="sm"
          className="title-bar-btn"
          style={{ minWidth: 32 }}
          onClick={() => electronWindow.electron?.window.maximize()}
          aria-label={isMaximized ? "Restaurar" : "Maximizar"}
        >
          <span aria-hidden>{isMaximized ? '❐' : '☐'}</span>
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="title-bar-btn"
          style={{ minWidth: 32 }}
          onClick={() => electronWindow.electron?.window.close()}
          aria-label="Cerrar"
        >
          <span aria-hidden>×</span>
        </Button>
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
  </>
);
}

export default Menu;

