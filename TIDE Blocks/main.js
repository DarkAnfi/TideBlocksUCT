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

function fileCompile(event, html) {
	const interpreter = new Interpreter(html);
	const txCode = interpreter.getCode();
	if (current_port) {
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
								child_process.exec(compiler.send(current_port), (error, stdout, stderr) => {
									mainWindow.webContents.send('file:compile', error, stdout, stderr);
									console.log('listo')
								});
							}
						});
					}
				});
			}
		});
	} else {
		console.log("Puerto no definido.")
		mainWindow.webContents.send('file:compile', { message: "Puerto no definido." }, "Puerto no definido.", "Puerto no definido.");
	}
}

ipcMain.on('test', function (event, html) {
	const interpreter = new Interpreter(html);
	console.log(interpreter.getCode());
});


function savefileas(event) {
	console.log("Guardando archivo .tb");
	dialog.showSaveDialog(function (fileName) {
		if (fileName === undefined) {
			console.log("No guardaste el archivo");
			return;
		}
		event.sender.send('update:name-project', fileName);
	});
}

function save(even, txCode, filename) {
	fs.writeFile(filename, txCode, function (err) {
		if (err) {
			console.log("Ha ocurrido un error creando el archivo: " + err.message)
		}
		console.log("El archivo ha sido creado satisfactoriamente");
	});
}

function openfile(event, response) {
	console.log("Buscando Archivo ...");
	dialog.showOpenDialog(function (filenames) {
		if (filenames === undefined) {
			console.log("No se selecciono ningun archivo");
		} else {
			readFile(event, filenames[0]);
		}
	});
}

function readFile(event, filepath) {
	fs.readFile(filepath, 'utf-8', function (err, data) {
		if (err) {
			alert("Ha ocurrido un error abriendo el archivo:" + err.message);
			return;
		}
		event.sender.send('contentData', data, filepath)
	});
}

function setPort(even, port) {
	current_port = port
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
ipcMain.on('ready:tosave', save);
ipcMain.on('nav:mini', navMini);
ipcMain.on('nav:maxi', navMaxi);
ipcMain.on('nav:exit', navExit);
ipcMain.on('file:compile', fileCompile);
ipcMain.on('open:files', openfile);
ipcMain.on('saveas:files', savefileas);
ipcMain.on('set:port', setPort)
app.on('ready', createMainWindow);