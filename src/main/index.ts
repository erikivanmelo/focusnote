import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { setupIpcRoutes } from './utils/ipcRoutes';
import { initDatabase } from './database/init';
import { Menu, MenuItem } from 'electron';
import { setupAutoUpdater, checkForUpdates, quitAndInstall } from './services/autoUpdaterService';
import log from 'electron-log';

// Enhanced log configuration
log.transports.file.level = 'debug';
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
// Set the log file path
const logPath = join(app.getPath('userData'), 'focusnote-debug.log');
log.transports.file.resolvePath = () => logPath;

// Catch unhandled exceptions and rejections
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', `An unexpected error occurred: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled Rejection:', reason);
});

log.info('=== Application Starting ===');
log.info('App Path:', app.getAppPath());
log.info('User Data Path:', app.getPath('userData'));
log.info('Environment:', process.env.NODE_ENV);
log.info('Platform:', process.platform, process.arch);

// Initialize database and set up IPC handlers
app.whenReady().then(() => {
  initDatabase();
  setupIpcRoutes(ipcMain);
  
  // Set up IPC handlers for updates
  ipcMain.handle('check-for-updates', async () => {
    return await checkForUpdates();
  });
  
  ipcMain.on('install-update', () => {
    quitAndInstall();
  });
});

function createWindow(): BrowserWindow {
  log.info('Creating main window...');
  
  // Window configuration
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      // Enable dev tools in production
      devTools: true,
      // Improve error messages
      nodeIntegrationInWorker: false,
      webSecurity: true,
      // Enable ES modules support
      // Enable require support in renderer process
      nodeIntegrationInSubFrames: false,
      // Enable webview support
      webviewTag: true,
      // Enable spellcheck support
      spellcheck: true
    },
    ...(process.platform === 'linux' ? { icon: join(__dirname, '../../resources/icon.png') } : {})
  });

  // Habilitar herramientas de desarrollo en producción
  mainWindow.webContents.on('did-frame-finish-load', () => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription) => {
    log.error('Failed to load window:', { errorCode, errorDescription });
    dialog.showErrorBox('Load Error', `Failed to load application: ${errorDescription}`);
  });

  // Register window events
  mainWindow.on('closed', () => {
    log.info('Main window closed');
  });

  mainWindow.on('unresponsive', () => {
    log.warn('Main window is unresponsive');
    dialog.showErrorBox('Error', 'The main window is not responding');
  });

  // Set up context menu for spell checking
  mainWindow.webContents.on('context-menu', (_, params) => {
    const menu = new Menu();

    // Add spelling suggestions
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(new MenuItem({
        label: suggestion,
        click: () => mainWindow.webContents.replaceMisspelling(suggestion)
      }));
    }

    // Allow adding words to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: 'Añadir al diccionario',
          click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
        })
      );
    }

    menu.popup();
  });

  // Window event handling
  ipcMain.on('window:minimize', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.minimize();
  });

  ipcMain.on('window:maximize', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  ipcMain.on('window:close', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) window.close();
  });

  ipcMain.handle('window:is-maximized', () => {
    const window = BrowserWindow.getFocusedWindow();
    return window ? window.isMaximized() : false;
  });

  // Notify renderer when maximized state changes
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximized', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:maximized', false);
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    
    // Open dev tools in development
    if (is.dev || process.env.DEBUG_PROD === 'true') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  // Handle opening external links in the default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Load the app in development or production
  if (is.dev) {
    // In development, load from the dev server
    const rendererUrl = process.env['ELECTRON_RENDERER_URL'] || 'http://localhost:3000';
    log.info('Cargando versión de desarrollo desde:', rendererUrl);
    mainWindow.loadURL(rendererUrl).catch((err: Error) => {
      log.error('Error loading development URL:', err);
      dialog.showErrorBox('Error', `Failed to load development version: ${err.message}`);
    });
  } else {
    // In production, load from the file system
    const indexPath = join(__dirname, '../renderer/index.html');
    log.info('Cargando versión de producción desde:', indexPath);
    
    import('fs').then(fs => {
      fs.access(indexPath, fs.constants.F_OK, (err) => {
        if (err) {
          log.error('Renderer file does not exist:', indexPath);
          dialog.showErrorBox('Error', `Renderer file not found at: ${indexPath}\n\n${err.message}`);
          return;
        }
        
        mainWindow.loadFile(indexPath).catch((loadErr: Error) => {
          log.error('Error loading production file:', loadErr);
          dialog.showErrorBox('Error', `Failed to load production version: ${loadErr.message}`);
        });
      });
    });
  }

  // Start auto-updater after the window is ready
  if (!is.dev) {
    setupAutoUpdater(mainWindow);
  } else {
    log.info('Running in development, auto-updater is disabled');
  }

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
