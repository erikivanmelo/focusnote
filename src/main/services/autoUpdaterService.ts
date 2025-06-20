import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
import log from 'electron-log';

// Configure logging system
autoUpdater.logger = log;
log.transports.file.level = 'info';
log.info('Auto-updater service initialized');

// Basic auto-updater configuration
autoUpdater.autoDownload = false; // Changed to false for first release
autoUpdater.autoInstallOnAppQuit = false; // Changed to false for first release

// Disable auto-update for first release
const IS_FIRST_RELEASE = true; // Set to false after first successful release

export function setupAutoUpdater(mainWindow: BrowserWindow | null): void {
  if (!mainWindow) {
    log.warn('Main window is not available for auto-updater');
    return;
  }

  if (IS_FIRST_RELEASE) {
    log.info('Skipping auto-update check for first release');
    return;
  }

  try {
    // Check for updates on startup
    autoUpdater.checkForUpdates().catch(err => {
      log.error('Error checking for updates:', err);
      // Don't show error to user for first release
      if (!IS_FIRST_RELEASE) {
        dialog.showErrorBox('Update Error', 'Failed to check for updates. Please check your internet connection.');
      }
    });
  } catch (error) {
    log.error('Unexpected error in auto-updater setup:', error);
  }

  // Event when an update is available
  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info.version);
    mainWindow.webContents.send('update-available', info);
    
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) is available. It will be downloaded and installed automatically.`,
      buttons: ['OK']
    });
  });

  // Event when no updates are available
  autoUpdater.on('update-not-available', (info) => {
    log.info('No updates available');
    mainWindow.webContents.send('update-not-available', info);
  });

  // Event when download is in progress
  autoUpdater.on('download-progress', (progressObj) => {
    log.info('Download progress:', progressObj);
    mainWindow.webContents.send('download-progress', progressObj);
  });

  // Event when download is complete
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info.version);
    mainWindow.webContents.send('update-downloaded', info);
    
    // Ask user if they want to install the update
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: `Version ${info.version} has been downloaded. Would you like to restart the application to install the update?`,
      buttons: ['Restart Later', 'Restart Now']
    }).then(({ response }) => {
      if (response === 1) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Error handling
  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
    mainWindow.webContents.send('update-error', err);
    
    dialog.showErrorBox(
      'Update Error',
      `An error occurred while checking for updates: ${err.message || 'Unknown error'}`
    );
  });

  // Check for updates every 30 minutes
  setInterval(() => {
    autoUpdater.checkForUpdates().catch(err => {
      log.error('Error in scheduled update check:', err);
    });
  }, 30 * 60 * 1000);
}

// Function to manually check for updates
export function checkForUpdates(): Promise<boolean> {
  return autoUpdater.checkForUpdates()
    .then(() => true)
    .catch(err => {
      log.error('Error checking for updates:', err);
      return false;
    });
}

// Function to quit and install updates
export function quitAndInstall(): void {
  autoUpdater.quitAndInstall();
}
