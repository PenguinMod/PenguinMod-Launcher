const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

import('fix-path').then(module => {
    module();
});

const IsDeveloperMode = true;

function createWindow() {
    const win = new BrowserWindow({
        title: "PenguinMod",
        icon: "favicon.ico",
        width: 1280,
        height: 720,
        backgroundColor: "#009CCC",
        webPreferences: {
            devTools: IsDeveloperMode,
            sandbox: false,
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.maximize();
    win.loadFile('index.html');
    if (!IsDeveloperMode) win.removeMenu();
    return win;
}

let window = null;
app.whenReady().then(() => {
    window = createWindow();
    window.ELECTRON_ENABLE_SECURITY_WARNINGS = true;
    app.___createdWindowForUse = window;
    app.setName('PenguinMod Studio');
    app.setAppUserModelId('com.penguinmod.PenguinMod');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            window = createWindow();
            app.___createdWindowForUse = window;
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle("showDialog", (_, message) => {
    return dialog.showMessageBoxSync(null, JSON.parse(message));
});
ipcMain.handle("showOpenDialog", (_, data) => {
    return dialog.showOpenDialog(null, JSON.parse(data));
});
ipcMain.handle("showSaveDialog", (_, data) => {
    return dialog.showSaveDialog(null, JSON.parse(data));
});
ipcMain.handle("setProgress", (_, precentage) => {
    return window.setProgressBar(Number(precentage));
});
ipcMain.handle("quitApp", (_, __) => {
    app.quit();
});