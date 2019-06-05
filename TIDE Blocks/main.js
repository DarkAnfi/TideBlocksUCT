const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Compiler = require('./js/compiler');
const Interpreter = require('./js/interpreter');
const child_process = require('child_process');
const { dialog } = require('electron')
const http = require('http');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let compiler = new Compiler();
let current_port = null;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		frame: true
	});
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'home.html'),
		protocol: 'file:',
		slashes: true
	}));
	mainWindow.on('closed', function () {
		app.quit();
	});
}

function navMini(event) {
	BrowserWindow.getFocusedWindow().minimize();
}

function navMaxi(event) {
	if (BrowserWindow.getFocusedWindow().isMaximized()) {
		BrowserWindow.getFocusedWindow().restore();
	} else {
		BrowserWindow.getFocusedWindow().maximize();
	}
}

function navExit(event) {
	BrowserWindow.getFocusedWindow().close();
}

function fileCompile(event, txCode) {
	mainWindow.webContents.send('log:open', 'Compilando')
	mainWindow.webContents.send('log:write', 'Analizando puerto.');
	if (current_port) {
		mainWindow.webContents.send('log:write', 'Iniciando proceso de compilación.');
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
				mainWindow.webContents.send('file:compile');
			} else {
				mainWindow.webContents.send('log:write', 'Validando parametros.');
				child_process.exec(compiler.dump_prefs(), (error, stdout, stderr) => {
					if (error) {
						mainWindow.webContents.send('log:write', error.message)
						mainWindow.webContents.send('file:compile');
					} else {
						mainWindow.webContents.send('log:write', 'Compilando.');
						child_process.exec(compiler.compile(), (error, stdout, stderr) => {
							if (error) {
								mainWindow.webContents.send('log:write', error.message);
								mainWindow.webContents.send('file:compile');
							} else {
								mainWindow.webContents.send('log:write', 'Enviando por el puerto ' + current_port + '.');
								child_process.exec(compiler.send(current_port), (error, stdout, stderr) => {
									if (error) {
										mainWindow.webContents.send('log:write', error.message);
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
	} else {
		mainWindow.webContents.send('log:write', 'Puerto no definido.');
		mainWindow.webContents.send('log:end')
		mainWindow.webContents.send('file:compile', { message: "Puerto no definido." }, "Puerto no definido.", "Puerto no definido.");
	}
}

function savefileas(event) {
	dialog.showSaveDialog(function (fileName) {
		if (fileName) {
			event.sender.send('update:name-project', fileName);
		}
	});
}

function save(even, txCode, filename) {
	fs.writeFile(filename, txCode, function (err) {
		if (err) {
			mainWindow.webContents.send("log:open", "Error");
			mainWindow.webContents.send("log:write", "Ha ocurrido un error creando el archivo: " + err.message);
			mainWindow.webContents.send("log:end");
		} else {
			mainWindow.webContents.send("log:open", "Listo");
			mainWindow.webContents.send("log:write", "El archivo ha sido guardado satisfactoriamente.");
			mainWindow.webContents.send("log:end");
		}
	});
}

function openfile(event, response) {
	dialog.showOpenDialog(function (filenames) {
		if (filenames) {
			readFile(event, filenames[0]);
		}
	});
}

function readFile(event, filepath) {
	fs.readFile(filepath, 'utf-8', function (err, data) {
		if (err) {
			mainWindow.webContents.send("log:open", "Error");
			mainWindow.webContents.send("log:write", "Ha ocurrido un error abriendo el archivo: " + err.message);
			mainWindow.webContents.send("log:end");
		} else {
			event.sender.send('contentData', data, filepath)
		}
	});
}

function setPort(even, port) {
	current_port = port
}

ipcMain.on('ready:tosave', save);
ipcMain.on('nav:mini', navMini);
ipcMain.on('nav:maxi', navMaxi);
ipcMain.on('nav:exit', navExit);
ipcMain.on('file:compile', fileCompile);
ipcMain.on('open:files', openfile);
ipcMain.on('saveas:files', savefileas);
ipcMain.on('set:port', setPort)
app.on('ready', createMainWindow);