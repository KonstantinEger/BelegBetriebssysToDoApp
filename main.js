const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");
const remote = require("@electron/remote/main");

remote.initialize();

app.on("ready", () => {
    const win = new BrowserWindow({
        width: 600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "app/index.html"),
        protocol: "file",
        slashes: true
    }));
    remote.enable(win.webContents);
});
