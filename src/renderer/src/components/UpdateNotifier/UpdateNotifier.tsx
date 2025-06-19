import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { CheckCircleFill, Download, ExclamationTriangleFill, InfoCircleFill } from 'react-bootstrap-icons';

// Types for the update API
declare global {
  interface Window {
    electron: {
      update: {
        onUpdateAvailable: (callback: (info: { version: string; releaseNotes?: string }) => void) => () => void;
        onDownloadProgress: (callback: (progress: { percent: number; bytesPerSecond: number; total: number; transferred: number }) => void) => () => void;
        onUpdateDownloaded: (callback: (info: { version: string; releaseNotes?: string }) => void) => () => void;
        onUpdateError: (callback: (error: Error) => void) => () => void;
        checkForUpdates: () => Promise<void>;
        quitAndInstall: () => void;
      };
    };
  }
}

interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

interface DownloadProgress {
  percent: number;
  bytesPerSecond: number;
  total: number;
  transferred: number;
}

const UpdateNotifier: React.FC = () => {
  const [show, setShow] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    // Check if window.electron and window.electron.update are available
    if (!window.electron || !window.electron.update) {
      console.error('Electron update API is not available');
      return;
    }

    const { update } = window.electron;

    // Set up event handlers
    const updateAvailableUnsubscribe = update.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo(info);
      setShow(true);
      setIsDownloading(true);
      setError(null);
    });

    const downloadProgressUnsubscribe = update.onDownloadProgress((progressObj: DownloadProgress) => {
      setProgress(progressObj);
    });

    const updateDownloadedUnsubscribe = update.onUpdateDownloaded((info: UpdateInfo) => {
      setUpdateInfo(info);
      setIsDownloading(false);
      setUpdateDownloaded(true);
      setShow(true);
    });

    const updateErrorUnsubscribe = update.onUpdateError((err: Error) => {
      setError(err.message);
      setIsDownloading(false);
      setShow(true);
    });

    // Check for updates when component mounts
    update.checkForUpdates().catch(err => {
      console.error('Error al verificar actualizaciones:', err);
    });

    // Clean up subscriptions when component unmounts
    return () => {
      updateAvailableUnsubscribe();
      downloadProgressUnsubscribe();
      updateDownloadedUnsubscribe();
      updateErrorUnsubscribe();
    };
  }, []);

  const handleInstallUpdate = (): void => {
    if (window.electron?.update) {
      window.electron.update.quitAndInstall();
    }
    setShow(false);
  };

  const renderToastBody = () => {
    if (error) {
      return (
        <>
          <Toast.Header closeButton={false}>
            <ExclamationTriangleFill className="me-2 text-danger" />
            <strong className="me-auto">Update Error</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>
            <p>{error}</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShow(false)}>
                Close
              </button>
            </div>
          </Toast.Body>
        </>
      );
    }

    if (updateDownloaded) {
      return (
        <>
          <Toast.Header closeButton={false}>
            <CheckCircleFill className="me-2 text-success" />
            <strong className="me-auto">Update Ready</strong>
            <small>Version {updateInfo?.version}</small>
          </Toast.Header>
          <Toast.Body>
            <p>Version {updateInfo?.version} is ready to install. Would you like to restart the application now?</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShow(false)}>
                Later
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleInstallUpdate}>
                Restart & Install
              </button>
            </div>
          </Toast.Body>
        </>
      );
    }

    if (isDownloading) {
      return (
        <>
          <Toast.Header closeButton={false}>
            <Download className="me-2 text-primary" />
            <strong className="me-auto">Downloading Update</strong>
            <small>Version {updateInfo?.version}</small>
          </Toast.Header>
          <Toast.Body>
            <div className="progress mb-2" style={{ height: '5px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress?.percent || 0}%` }}
                aria-valuenow={progress?.percent || 0}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <span>{Math.round(progress?.percent || 0)}%</span>
              <span>{progress ? `${Math.round(progress.bytesPerSecond / 1024)} KB/s` : ''}</span>
            </div>
          </Toast.Body>
        </>
      );
    }

    return (
      <>
        <Toast.Header closeButton={false}>
          <InfoCircleFill className="me-2 text-info" />
          <strong className="me-auto">Checking for Updates</strong>
        </Toast.Header>
        <Toast.Body>
          <p>Checking for available updates...</p>
        </Toast.Body>
      </>
    );
  };

  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 1100 }}>
      <Toast 
        show={show} 
        onClose={() => setShow(false)}
        autohide={!isDownloading && !updateDownloaded && !error}
        delay={5000}
        className="shadow"
      >
        {renderToastBody()}
      </Toast>
    </ToastContainer>
  );
};

export default UpdateNotifier;
