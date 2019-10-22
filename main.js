const electron = require('electron');
const path = require('path');
const url = require('url');
const ipcMain = require('electron').ipcMain;
const DiscordRPC = require('discord-rpc');

let win;

var IMG_DIR = '/img/';
var APP_DIR = '/app/';

const { app, BrowserWindow } = require('electron');

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 250,
        icon: path.join(__dirname, APP_DIR, IMG_DIR, "notifysquaredrawlogo.png"),
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        },
    });

    win.webContents.on("devtools-closed", () => { win.webContents.closeDevTools(); });
    
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, APP_DIR, 'auth.html'),
        protocol: 'file:',
        slashes: true
    }));
};

app.on('ready', () => {
    createWindow();
    ipcMain.on('add_account', (event, arg) => {
        var i = 0;
        var windows = BrowserWindow.getAllWindows();
        for (i = 0; i < windows.length; i++) {
            if (windows[i].getTitle() == "Notify Captcha") {
                windows[i].webContents.send('add_account', arg);
            };
        };
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

const clientId = '619946986056974361';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' })
const startTimestamp = new Date();

async function setActivity() {
    if (!rpc || !win) {
        return;
    }

    rpc.setActivity({
        details: `Running 1 Module`,
        state: 'Notify Captcha',
        startTimestamp,
        largeImageKey: 'logo',
        largeImageText: 'v1.0.1',
        instance: false,
    });
}

rpc.on('ready', function () {
    setActivity();

    setInterval(function () {
        setActivity();
    }, 15e3);
});

rpc.login({ clientId }).catch(console.error);

