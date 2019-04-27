const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

let mainWindow;
var Code;

function createMainWindow () {
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
	mainWindow.on('closed', function() {
		app.quit();
	});
}

function navMini (event) {
	BrowserWindow.getFocusedWindow().minimize();
}

function navMaxi (event) {
	if (BrowserWindow.getFocusedWindow().isMaximized()) {
		BrowserWindow.getFocusedWindow().restore();
	} else {
		BrowserWindow.getFocusedWindow().maximize();
	}
}

function navExit (event) {
	BrowserWindow.getFocusedWindow().close();
}

function testcompiler (event, txCode) {
	Code = txCode
	let content= txCode;
	const filename = path.join(__dirname,'temp','prueba.ino');
	fs.writeFile(filename,content, (err)=>{
		if(err){
			console.log("Ha ocurrido un error al crear el archivo:" + err.message)
		}
		console.log("El archivo se creo correctamente")
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