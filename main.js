const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const MinecraftCore = require("minecraft-java-core");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));
}

// Получаем команду от кнопки "Играть"
ipcMain.handle("launch-minecraft", async (event, nick) => {
    try {
        console.log("Запускаем Minecraft для:", nick);

        const options = {
            path: path.join(__dirname, "minecraft"),
            version: "1.21.1",

            authenticator: {
                name: nick,
                uuid: "00000000-0000-0000-0000-000000000000",
                access_token: "0",
                user_properties: "{}",
                meta: {
                    type: "offline"
                }
            },

            verify: false,

            downloadFileMultiple: 10,

            memory: {
                min: "2G",
                max: "4G"
            }
        };

        const launcher = new MinecraftCore.Launch();

        launcher.on("error", (error) => {
            console.error("ОШИБКА MINECRAFT:", error);
        });

        await launcher.Launch(options);

        console.log("Minecraft запускается");

        return {
            success: true
        };

    } catch (error) {
        console.error("Ошибка запуска Minecraft:", error);

        return {
            success: false,
            error: error.message || String(error)
        };
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});