var path = require('path');

function Compiler() {
	var self = this;

	self.init = function () {
		self.libraries = path.join(__dirname, '..', 'libraries');
		self.build_path = path.join(__dirname, '..', 'temp', 'build');
		self.sketch = path.join(__dirname, '..', 'temp', 'temp.ino');
		self.hex = path.join(__dirname, '..', 'temp', 'build', 'temp.ino.hex');
		self.arduino_builder = path.join(__dirname, '..', 'bin', 'builder', 'arduino_builder');
		self.hardware = path.join(__dirname, '..', 'bin', 'builder', 'hardware');
		self.tools_builder = path.join(__dirname, '..', 'bin', 'builder', 'tools-builder');
		self.tools_avr = path.join(__dirname, '..', 'bin', 'builder', 'hardware', 'tools', 'avr');
		self.built_in_libraries = path.join(__dirname, '..', 'bin', 'builder', 'libraries');
		self.avrdude = path.join(__dirname, '..', 'bin', 'builder', 'hardware', 'tools', 'avr', 'bin', 'avrdude');
		self.avrdude_conf = path.join(__dirname, '..', 'bin', 'builder', 'hardware', 'tools', 'avr', 'etc', 'avrdude.conf');

	}
	self.dump_prefs = function () {
		cmd = `${self.arduino_builder} -dump-prefs -logger=machine -hardware ${self.hardware} -tools ${self.tools_builder} -tools ${self.tools_avr} -built-in-libraries ${self.built_in_libraries} -libraries ${self.libraries} -fqbn=arduino:avr:uno -ide-version=10805 -build-path ${self.build_path} -warnings=null -prefs=build.path=${self.build_path} -prefs=build.warn_data_percentage=75 -prefs=runtime.tools.arduinoOTA.path= ${self.tools_avr} -prefs=runtime.tools.avr-gcc.path=${self.tools_avr} -prefs=runtime.tools.avrdude.path=${self.tools_avr} -verbose ${self.sketch}`
		return cmd
	}
	self.compile = function () {
		cmd = `${self.arduino_builder} -compile -logger=machine -hardware ${self.hardware} -tools ${self.tools_builder} -tools ${self.tools_avr} -built-in-libraries ${self.built_in_libraries} -libraries ${self.libraries} -fqbn=arduino:avr:uno -ide-version=10805 -build-path ${self.build_path} -warnings=null -prefs=build.path=${self.build_path} -prefs=build.warn_data_percentage=75 -prefs=runtime.tools.arduinoOTA.path= ${self.tools_avr} -prefs=runtime.tools.avr-gcc.path=${self.tools_avr} -prefs=runtime.tools.avrdude.path=${self.tools_avr} -verbose ${self.sketch}`
		return cmd
	}
	self.send = function (port) {
		cmd = `${self.avrdude} -C${self.avrdude_conf} -v -patmega328p -carduino -P${port} -b115200 -D -Uflash:w:${self.hex}:i `
		return cmd
	}
	self.init();
	return self;
}

module.exports = Compiler;
