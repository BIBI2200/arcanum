const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    launchMinecraft: (nick) => {
        return ipcRenderer.invoke("launch-minecraft", nick);
    }
});