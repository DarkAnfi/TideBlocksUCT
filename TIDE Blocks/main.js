const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

const {app, BrowserWindow, Menu, ipcMain} = electron;


let mainWindow;
let openDialog;

/* Listen for app to be ready */
app.on('ready', function () {
	/* Create new window */
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		frame: false
	});
	/* Load html into window */
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'home.html'),
		protocol: 'file:',
		slashes: true
	}));
	/* Quit app when closed*/
	mainWindow.on('closed', function() {
		app.quit();
	});
	/* Remove menu bar */
	//Menu.setApplicationMenu(null);
});

/* Handle create open dialog */
function createOpenDialog () {
	/* Create new window */
	openDialog = new BrowserWindow({
		width: 400,
		height: 300,
		minWidth: 400,
		minHeight: 300,
		maxWidth: 400,
		maxHeight: 300,
		minimizable: false,
		maximizable: false,
		frame: false
	});
	/* Load html into window */
	openDialog.loadURL(url.format({
		pathname: path.join(__dirname, 'open.html'),
		protocol: 'file:',
		slashes: true
	}));
}

/* Listen for app events */
ipcMain.on('nav:mini', function(event) {
	BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on('nav:maxi', function(event) {
	if (BrowserWindow.getFocusedWindow().isMaximized()) {
		BrowserWindow.getFocusedWindow().restore();
	} else {
		BrowserWindow.getFocusedWindow().maximize();
	}
});

ipcMain.on('nav:exit', function(event) {
	BrowserWindow.getFocusedWindow().close();
});

ipcMain.on('file:open', function(event) {
	createOpenDialog();
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