const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Compiler = require('./js/compiler');
const child_process = require('child_process');
const {dialog} = require('electron')
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
	const filename = path.join(__dirname, 'temp', 'temp.ino');
	console.log("Creando archivo temp.ino...");
	fs.writeFile(filename, txCode, (error) => {
		if (error) {
			console.log("Ha ocurrido un error al crear el archivo:" + error.message)
		} else {
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

function savefileas(event, txCode){
	Code=txCode
	console.log("Guardando archivo .tb");
	let content=txCode;
	
	dialog.showSaveDialog(function (fileName) {
		if (fileName === undefined){
			 console.log("No guardaste el archivo");
			 return;
		}
		
		fs.writeFile(fileName, content, function (err) {
			if(err){
				console.log("Ha ocurrido un error creando el archivo: "+ err.message)
			}
						 
			console.log("El archivo ha sido creado satisfactoriamente");
		});
 	});
}

function savefile(event,txCode){
	Code=txCode
	console.log("Actualizando archivo");
	let content=txCode;
	const filename = path.join(__dirname,'temp','prueba.ino');
	fs.writeFile(filename,content, (err)=>{
		if(err){
			console.log("Ha ocurrido un error al crear el archivo:" + err.message)
		}
		console.log("El archivo se actualizo correctamente")
		});
}

function openfile(event){
	console.log("Buscando Archivo ...");
	
	dialog.showOpenDialog(function (filenames) {
       if(filenames === undefined){
            console.log("No se selecciono ningun archivo");
       }else{
            readFile(filenames[0]);
       }
	});

	function readFile(filepath){
		fs.readFile(filepath, 'utf-8', function (err, data) {
			if(err){
				alert("Ha ocurrido un error abriendo el archivo:" + err.message);
				return;
			}
			console.log("El contenido del archivo es : " + data);
			event.sender.send('contentData', data)
		});
	}
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
ipcMain.on('open:files', openfile);
ipcMain.on('saveas:files', savefileas);
ipcMain.on('save:files',savefile);
ipcMain.on('test:compiler', testcompiler);
app.on('ready', createMainWindow);