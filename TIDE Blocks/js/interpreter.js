function Interpreter(options, html) {
    var self = this;

    self.init = function (html, options) {
        options = options ? options : {};
        self._imports = (options.imports) ? options.imports : ["Servo.h"];
        self._global = (options.global) ? options.global : "Servo SERVO1;\nServo SERVO2;Repeat repeat\n";
        self._setup = (options.setup) ? options.setup : "pinMode(4, OUTPUT);\npinMode(5, OUTPUT);\npinMode(6, OUTPUT);\npinMode(13, OUTPUT);\nSERVO1.attach(12);\nSERVO2.attach(11);";
        self._debug = (options.debug) ? options.debug : false;
        self._html = (html) ? html : [];
    }

    self.html = function (html) {
        if (html) {
            self._html = html;
            return self;
        } else {
            return self._html;
        }
    }

    self.options = function (options) {
        if (options) {
            self._imports = (options.imports) ? options.imports : ["Servo.h"];
            self._global = (options.global) ? options.global : "Servo SERVO1;\nServo SERVO2;\nRepeat repeat";
            self._setup = (options.setup) ? options.setup : "pinMode(LED_G, OUTPUT);\npinMode(LED_Y, OUTPUT);\npinMode(LED_R, OUTPUT);\npinMode(LED_W, OUTPUT);\nSERVO1.attach(S1);\nSERVO2.attach(S2);";
            self._debug = (options.debug) ? options.debug : false;
            return self;
        } else {
            return {
                imports: self._imports,
                global: self._global,
                setup: self._setup,
                debug: self._debug
            }
        }
    }

    self.prepare = function (html) {
        html = (html) ? html : self._html;
        var tree = [];
        var index=1;
        html.forEach(e1 => {
            if ((" " + e1.attribs.class + " ").includes(' block ')) {
                e1.children.forEach(e2 => {
                    if (e2.attribs) {
                        if (e2.attribs['data-block']) {
                            switch (e2.attribs['data-block']) {
                                case 'block-led-w-on':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['13', 'HIGH']
                                    });
                                    break;
                                case 'block-led-r-on':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['6', 'HIGH']
                                    });
                                    break;
                                case 'block-led-y-on':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['5', 'HIGH']
                                    });
                                    break;
                                case 'block-led-g-on':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['4', 'HIGH']
                                    });
                                    break;
                                case 'block-led-w-off':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['13', 'LOW']
                                    });
                                    break;
                                case 'block-led-r-off':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['6', 'LOW']
                                    });
                                    break;
                                case 'block-led-y-off':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['5', 'LOW']
                                    });
                                    break;
                                case 'block-led-g-off':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'digitalWrite',
                                        args: ['4', 'LOW']
                                    });
                                    break;
                                case 'delay':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'delay',
                                        args: [e2.attribs['data-value']]
                                    });
                                    break;
                                case 'servo1':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'SERVO1.write',
                                        args: [e2.attribs['data-value']]
                                    });
                                    break;
                                case 'servo2':
                                    tree.push({
                                        block: 'callFunction',
                                        name: 'SERVO2.write',
                                        args: [e2.attribs['data-value']]
                                    });
                                    break;
                                case 'while':
                                    tree.push({
                                        block: 'while',
                                        condition: e1.attribs['data-condition'],
                                        content: self.prepare(e1.children[3].children)
                                    });
                                    break;
                                case 'repeat':
                                    tree.push({
                                        block: 'repeat',
                                        args: [e2.attribs['data-value']]
                                        content: self.prepare(e1.children[3].children)
                                    });
                                    break;
                                case 'setter':
                                    tree.push({
                                        block: 'setter',
                                        name: e2.attribs['data-name'],
                                        type: e2.attribs['data-type'],
                                        value: e2.attribs['data-value'],
                                    });
                                    break;
                            }
                        }
                    }
                });
            }
        });
        return tree
    }

    self.build = function (identation, tree) {
        var code = "";
        tree.forEach(
            (element) => {
                switch (element.block) {
                    case 'callFunction':
                        code += ' '.repeat(4 * identation) + element.name + "(" + element.args.join(', ') + ");\n";
                        break;
                    case 'while':
                        code += ' '.repeat(4 * identation) + 'while(' + element.condition + "){\n";
                        code += self.build(identation+1,element.content);
                        code+= ''.repeat(4 * identation)+'}\n'
                        break;
                    case 'repeat':
                        code += ' '.repeat(4 * identation) + 'repeat('+element.args[0] +',[](){';
                        code += self.build(identation+1,element.content);
                        code+= ''.repeat(4 * identation)+'})\n'
                        break;
                    case 'setter':
                        switch (element.type) {
                            case 'String':
                                if (element.value) {
                                    code += ' '.repeat(4 * identation) + element.name + " = \"" + element.value + "\";"
                                } else {
                                    code += ' '.repeat(4 * identation) + element.name + " = \"\";"
                                }
                                break;
                            case 'char':
                                if (element.value) {
                                    if (element.value.length == 1) {
                                        code += ' '.repeat(4 * identation) + element.name + " = \'" + element.value + "\';"
                                    } else {
                                        code += ' '.repeat(4 * identation) + element.name + " = 0;"
                                    }
                                } else {
                                    code += ' '.repeat(4 * identation) + element.name + " = 0;"
                                }
                                break;
                            case 'int':
                                if (element.value) {
                                    if (-32768 <= element.value && element.value <= 32767) {
                                        code += ' '.repeat(4 * identation) + element.name + " = " + element.value + ";"
                                    } else {
                                        code += ' '.repeat(4 * identation) + element.name + " = 0;"
                                    }
                                } else {
                                    code += ' '.repeat(4 * identation) + element.name + " = 0;"
                                }
                                break;
                        }
                        break;
                }
            }
        )
        return code;
    }

    self.getCode = function () {
        var code = "";
        self._imports.forEach(element => {
            code += "#include <" + element + ">\n";
        });
        code += "\n"
        code += self._global;
        code += "\nvoid repeat(int _NR, void (*_CR)()) {\n";
        code += "   for (int _IR = 0; _IR < _NR; _IR++) {\n";
        code += "       _CR();\n";
        code += "   }\n";
        code += "}\n";
        code += "\nvoid setup() {\n";
        self._setup.split('\n').forEach(element => {
            code += "    " + element + "\n";
        });
        code += "}\n";
        code += "\nvoid loop() {\n";
        code += self.build(1, self.prepare());
        code += "}\n";

        return code;
    }

    self.init(options, html);
    return self;
}

module.exports = Interpreter;