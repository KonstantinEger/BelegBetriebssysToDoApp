const {app, BrowserWindow} = require("electron");

app.on("ready", () => {
    const win = new BrowserWindow({
        width: 600,
        height: 900
    });
    win.loadURL("https://www.google.com/");
});
