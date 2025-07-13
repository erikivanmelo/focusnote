import { Modal as BootstrapModal } from "react-bootstrap";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import './Modal.scss';

interface RouteModalProps {
    children: ReactNode;
    size?: 'sm' | 'lg' | 'xl';
    centered?: boolean;
    backdrop?: boolean | 'static';
    keyboard?: boolean;
    className?: string;
}

export function RouteModal({
    children,
    size = 'lg',
    centered = true,
    backdrop = true,
    keyboard = true,
    className = 'minimalist-modal'
}: RouteModalProps) {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <BootstrapModal
            show={true}
            onHide={handleClose}
            backdrop={backdrop}
            keyboard={keyboard}
            centered={centered}
            size={size}
            dialogClassName={className}
            contentClassName='minimalist-modal-content'
            animation={false}
        >
            <div className="modal-close-button-wrapper">
                <button
                    className="close-button"
                    onClick={handleClose}
                    aria-label="Go back"
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>
            <BootstrapModal.Body className='p-0'>
                {children}
            </BootstrapModal.Body>
        </BootstrapModal>
    );
}

export default RouteModal;
