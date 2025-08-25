import { useState, useEffect} from "react";
import './TitleBar.scss'

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

function TitleBar() {
    const [isMaximized, setIsMaximized] = useState<boolean>(false);

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

    return (
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
    );
}

export default TitleBar;
