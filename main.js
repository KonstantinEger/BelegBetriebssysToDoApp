const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

app.on("ready", () => {
    const win = new BrowserWindow({
        width: 600,
        height: 900
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "app/index.html"),
        protocol: "file",
        slashes: true
    }));
});
