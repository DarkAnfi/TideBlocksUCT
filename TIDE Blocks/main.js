const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Compiler = require('./js/compiler');
const child_process = require('child_process');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let compiler = new Compiler();

function createMainWindow() {
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		frame: false
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

function testcompiler(event, txCode) {
	if (!fs.existsSync(path.join(__dirname, 'temp'))) {
		fs.mkdirSync(path.join(__dirname, 'temp'));
	}
	const filename = path.join(__dirname, 'temp', 'temp.ino');
	console.log("Creando archivo temp.ino...");
	fs.writeFile(filename, txCode, (error) => {
		if (error) {
			console.log("Ha ocurrido un error al crear el archivo:" + error.message)
		} else {
			if (!fs.existsSync(path.join(__dirname, 'temp', 'build'))) {
				fs.mkdirSync(path.join(__dirname, 'temp', 'build'));
			}
			console.log("Archivo temp.ino creado.");
			console.log("Validando configuracion...");
			child_process.exec(compiler.dump_prefs(), (error, stdout, stderr) => {
				if (error) {
					console.log(error.message);
				} else {
					console.log("Configuracion validada.")
					console.log("Compilando...")
					child_process.exec(compiler.compile(), (error, stdout, stderr) => {
						if (error) {
							console.log(error.message);
						} else {
							console.log("Compilado con exito.");
							console.log("Enviando al puerto COM4");
							child_process.exec(compiler.send('COM4'), (error, stdout, stderr) => {
								if (error) {
									console.log(error.message);
								} else {
									console.log("Envio con exito.");
								}
							});
						}
					});
				}
			});
		}
	});
}

/*
ipcMain.on('file:open', function(event, dirname) {
	if (dirname == undefined) {
		dirname = __dirname;
	}
	fs.readdir(dirname, function(err, items) {
		items.unshift('..');
		mainWindow.webContents.send('file:open',dirname, items)
	});
});
*/

ipcMain.on('nav:mini', navMini);
ipcMain.on('nav:maxi', navMaxi);
ipcMain.on('nav:exit', navExit);
ipcMain.on('test:compiler', testcompiler);
app.on('ready', createMainWindow);