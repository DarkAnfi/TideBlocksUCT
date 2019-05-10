const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Compiler = require('./js/compiler');
const Interpreter = require('./js/interpreter');
const child_process = require('child_process');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let compiler = new Compiler();

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
	console.log('Iniciando proceso de compilación...')
	if (!fs.existsSync(path.join(__dirname, 'temp'))) {
		fs.mkdirSync(path.join(__dirname, 'temp'));
	}
	if (!fs.existsSync(path.join(__dirname, 'temp', 'build'))) {
		fs.mkdirSync(path.join(__dirname, 'temp', 'build'));
	}
	const filename = path.join(__dirname, 'temp', 'temp.ino');
	fs.writeFile(filename, txCode, (error) => {
		if (error) {
			mainWindow.webContents.send('file:compile', error, "Ha ocurrido un error al crear el archivo.", error.message);
		} else {
			child_process.exec(compiler.dump_prefs(), (error, stdout, stderr) => {
				if (error) {
					mainWindow.webContents.send('file:compile', error, stdout, stderr);
				} else {
					child_process.exec(compiler.compile(), (error, stdout, stderr) => {
						if (error) {
							mainWindow.webContents.send('file:compile', error, stdout, stderr);
						} else {
							child_process.exec(compiler.send('COM4'), (error, stdout, stderr) => {
								mainWindow.webContents.send('file:compile', error, stdout, stderr);
								console.log('listo')
							});
						}
					});
				}
			});
		}
	});
}

ipcMain.on('test', function (event, html) {
	const interpreter = new Interpreter(html);
	console.log(interpreter.getCode());
});

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
ipcMain.on('file:compile', fileCompile);
app.on('ready', createMainWindow);