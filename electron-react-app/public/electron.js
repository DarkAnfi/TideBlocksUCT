const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const serialport = require('serialport');
const Compiler = require('./compiler');
const fs = require('fs');
const child_process = require('child_process');

let mainWindow;
let compiler = new Compiler();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '..', 'build', 'index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.on('resize', () => {
        mainWindow.webContents.send('mainWindow:isMaximized', mainWindow.isMaximized());
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('mainWindow:minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('mainWindow:isMaximized', () => {
    mainWindow.webContents.send('mainWindow:isMaximized', mainWindow.isMaximized());
});

ipcMain.on('mainWindow:maximize', () => {
    mainWindow.maximize();
    mainWindow.webContents.send('mainWindow:isMaximized', true);
});

ipcMain.on('mainWindow:restore', () => {
    mainWindow.restore();
    mainWindow.webContents.send('mainWindow:isMaximized', false);
});

ipcMain.on('mainWindow:close', () => {
    mainWindow.close();
});

ipcMain.on('serialport:list', () => {
    serialport.list((event, ports) => {
        mainWindow.webContents.send('serialport:list', ports);
    });
});

ipcMain.on('compiler:send', (event, txCode, port) => {
    mainWindow.webContents.send('log:open', 'Compilando');
    mainWindow.webContents.send('log:write', 'Iniciando proceso de compilación. Por favor no desconecte el dispositivo.');
    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
        fs.mkdirSync(path.join(__dirname, 'temp'));
    }
    if (!fs.existsSync(path.join(__dirname, 'temp', 'build'))) {
        fs.mkdirSync(path.join(__dirname, 'temp', 'build'));
    }
    const filename = path.join(__dirname, 'temp', 'temp.ino');
    fs.writeFile(filename, txCode, (error) => {
        if (error) {
            mainWindow.webContents.send('log:write', 'Ha ocurrido un error al crear el archivo.');
            mainWindow.webContents.send('log:end');
            mainWindow.webContents.send('file:compile');
        } else {
            mainWindow.webContents.send('log:write', 'Validando configuración. Por favor no desconecte el dispositivo.');
            child_process.exec(compiler.dump_prefs(), (error, stdout, stderr) => {
                if (error) {
                    mainWindow.webContents.send('log:write', 'Error de configuración.');
                    mainWindow.webContents.send('log:end');
                    mainWindow.webContents.send('file:compile');
                } else {
                    mainWindow.webContents.send('log:write', 'Compilando. Por favor no desconecte el dispositivo.');
                    child_process.exec(compiler.compile(), (error, stdout, stderr) => {
                        if (error) {
                            mainWindow.webContents.send('log:write', 'Error de compilación.');
                            mainWindow.webContents.send('log:end');
                            mainWindow.webContents.send('file:compile');
                        } else {
                            mainWindow.webContents.send('log:write', 'Enviando por el puerto ' + port + '. Por favor no desconecte el dispositivo.');
                            child_process.exec(compiler.send(port), (error, stdout, stderr) => {
                                if (error) {
                                    mainWindow.webContents.send('log:write', 'Error al enviar por el puerto ' + port + '.');
                                } else {
                                    mainWindow.webContents.send('log:write', 'Listo.');
                                }
                                mainWindow.webContents.send('log:end');
                                mainWindow.webContents.send('file:compile');
                            });
                        }
                    });
                }
            });
        }
    });
});

ipcMain.on('fs:open', (event) => {
    dialog.showOpenDialog(
        mainWindow,
        {
            filters: [
                { name: 'CT Blocks', extensions: ['ctb'] }
            ]
        },
        (filenames) => {
            if (filenames) {
                fs.readFile(filenames[0], 'utf-8', (error, data) => {
                    if (error) {
                        mainWindow.webContents.send("log:open", "Error");
                        mainWindow.webContents.send("log:write", "Ha ocurrido un error abriendo el archivo: " + err.message);
                        mainWindow.webContents.send("log:end");
                    } else {
                        mainWindow.webContents.send('fs:open', path.resolve(filenames[0]), JSON.parse(data))
                    }
                });
            }
        }
    );
});

ipcMain.on('fs:save', (event, filename, data, triggered, eventPorLlamar, opendata) => {
    if (filename) {
        fs.writeFile(filename, JSON.stringify(data),
            (error) => {
                if (error) {
                    mainWindow.webContents.send("log:open", "Error");
                    mainWindow.webContents.send("log:write", "Ha ocurrido un error creando el archivo: " + err.message);
                    mainWindow.webContents.send("log:end");
                } else {
                    mainWindow.webContents.send("log:open", "Listo");
                    mainWindow.webContents.send("log:write", "El archivo ha sido guardado satisfactoriamente.");
                    mainWindow.webContents.send("log:end");
                    if(triggered === false){
                        mainWindow.webContents.send("fs:save", path.resolve(filename));
                        if (eventPorLlamar.type === "openfile") {
                            mainWindow.webContents.send(eventPorLlamar.protocol, eventPorLlamar.type, opendata);
                        }else{
                            mainWindow.webContents.send(eventPorLlamar.protocol, eventPorLlamar.type);
                        } 
                    }
                }
            }
        );
    }
});

ipcMain.on('fs:saveas', (event, filename, data, triggered, eventPorLlamar, opendata) => {
    dialog.showSaveDialog(
        mainWindow,
        {
            defaultPath: filename,
            filters: [
                { name: 'CT Blocks', extensions: ['ctb'] }
            ]
        },
        (filename) => {
            if (filename) {
                fs.writeFile(filename, JSON.stringify(data),
                    (error) => {
                        if (error) {
                            mainWindow.webContents.send("log:open", "Error");
                            mainWindow.webContents.send("log:write", "Ha ocurrido un error creando el archivo: " + err.message);
                            mainWindow.webContents.send("log:end");
                        } else {
                            mainWindow.webContents.send("log:open", "Listo");
                            mainWindow.webContents.send("log:write", "El archivo ha sido guardado satisfactoriamente.");
                            mainWindow.webContents.send("log:end");
                            if(triggered === false){
                                mainWindow.webContents.send("fs:saveas", path.resolve(filename), path.basename(filename));
                                if (eventPorLlamar.type === "openfile") {
                                    mainWindow.webContents.send(eventPorLlamar.protocol, eventPorLlamar.type, opendata);
                                }else{
                                    mainWindow.webContents.send(eventPorLlamar.protocol, eventPorLlamar.type);
                                } 
                            }
                        }
                    }
                );
            }
        }
    );
});

ipcMain.on('fs:export', (event, filename, data) => {
    dialog.showSaveDialog(
        mainWindow,
        {
            defaultPath: filename,
            filters: [
                { name: 'Arduino Code', extensions: ['ino'] }
            ]
        },
        (filename) => {
            if (filename) {
                fs.writeFile(path.join(path.dirname(filename), path.basename(filename).replace(/ /g, '_')), data,
                    (error) => {
                        if (error) {
                            mainWindow.webContents.send("log:open", "Error");
                            mainWindow.webContents.send("log:write", "Ha ocurrido un error creando el archivo: " + err.message);
                            mainWindow.webContents.send("log:end");
                        } else {
                            mainWindow.webContents.send("log:open", "Listo");
                            mainWindow.webContents.send("log:write", "Se ha exportado exitosamente.");
                            mainWindow.webContents.send("log:end");
                        }
                    }
                );
            }
        }
    );
});