function Interpreter(html, options) {
    var self = this;

    self.init = function (html, options) {
        options = options ? options : {};
        self._imports = (options.imports) ? options.imports : ["Servo.h"];
        self._global = (options.global) ? options.global : [
            { block: 'execute', command: 'bool _NULL = 0' },
            { block: 'execute', command: 'Servo SERVO1' },
            { block: 'execute', command: 'Servo SERVO2' }
        ];
        self._setup = (options.setup) ? options.setup : "pinMode(4, OUTPUT);\npinMode(5, OUTPUT);\npinMode(6, OUTPUT);\npinMode(13, OUTPUT);\nSERVO1.attach(12);\nSERVO2.attach(11);";
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
            self._imports = (options.imports) ? options.imports : self._imports;
            self._global = (options.global) ? options.global : self._global;
            self._setup = (options.setup) ? options.setup : self._setup;
            return self;
        } else {
            return {
                imports: self._imports,
                global: self._global,
                setup: self._setup
            }
        }
    }

    self.prepare = function (html) {
        html = (html) ? html : self._html;
        var tree = [];
        var elements = {};
        html.forEach(e1 => {
            if (e1.attribs['data-block']) {
                switch (e1.attribs['data-block']) {
                    case 'led-on':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0];
                        tree.push({
                            block: 'callFunction',
                            name: 'digitalWrite',
                            args: [elements[0].name == "select" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 13)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 13), 'HIGH']
                        });
                        break;
                    case 'led-off':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0];
                        tree.push({
                            block: 'callFunction',
                            name: 'digitalWrite',
                            args: [elements[0].name == "select" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 13)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 13), 'LOW']
                        });
                        break;
                    case 'delay':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                        tree.push({
                            block: 'callFunction',
                            name: 'delay',
                            args: [
                                elements[0].name == "input" ?
                                    (elements[0].attribs.value ? elements[0].attribs.value : 1000)
                                    :
                                    (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 1000)
                            ]
                        });
                        break;
                    case 'if':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                        tree.push({
                            block: 'if',
                            condition: elements[0].name == "input" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 1)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 1),
                            content: e1.children[1] ? self.prepare(e1.children[1].children) : []
                        });
                        break;
                    case 'else':
                        tree.push({
                            block: 'else',
                            content: e1.children[1] ? self.prepare(e1.children[1].children) : []
                        });
                        break;
                    case 'servo1':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                        tree.push({
                            block: 'callFunction',
                            name: 'SERVO1.write',
                            args: [elements[0].name == "input" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 0)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 0)]
                        });
                        break;
                    case 'servo2':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                        tree.push({
                            block: 'callFunction',
                            name: 'SERVO2.write',
                            args: [elements[0].name == "input" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 0)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 0)]
                        });
                        break;
                    case 'while':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                        tree.push({
                            block: 'while',
                            condition: elements[0].name == "input" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 1)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 1),
                            content: e1.children[1] ? self.prepare(e1.children[1].children) : []
                        });
                        break;
                    case 'repeat':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                        tree.push({
                            block: 'repeat',
                            steps: elements[0].name == "input" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : 1)
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : 1),
                            content: e1.children[1] ? self.prepare(e1.children[1].children) : []
                        });
                        break;
                    case 'setter':
                        elements[0] = e1.children[0].children[0].children[0].children[0].children[0].children[0];
                        elements[1] = e1.children[0].children[0].children[0].children[0].children[2].children[0].children[0];
                        console.log(elements)
                        tree.push({
                            block: 'setter',
                            name: elements[0].name == "select" ?
                                (elements[0].attribs.value ? elements[0].attribs.value : '_NULL')
                                :
                                (elements[0].attribs["data-block"] == "value" ? elements[0].attribs["data-name"] : '_NULL'),
                            value: elements[1].name == "input" ?
                                (elements[1].attribs.value ? elements[1].attribs.value : 0)
                                :
                                (elements[1].attribs["data-block"] == "value" ? elements[1].attribs["data-name"] : 0),
                        });
                        break;
                }
            }
        });
        return tree
    }

    self.build = function (identation, tree) {
        var code = "";
        tree.forEach(
            (element) => {
                switch (element.block) {
                    case 'execute':
                        code += ' '.repeat(4 * identation) + element.command + ';\n';
                        break;
                    case 'callFunction':
                        code += ' '.repeat(4 * identation) + element.name + "(" + element.args.join(', ') + ");\n";
                        break;
                    case 'while':
                        code += ' '.repeat(4 * identation) + 'while(' + element.condition + "){\n";
                        code += self.build(identation + 1, element.content);
                        code += ' '.repeat(4 * identation) + '}\n'
                        break;
                    case 'repeat':
                        code += ' '.repeat(4 * identation) + 'repeat(' + element.steps + ',[](){\n';
                        code += self.build(identation + 1, element.content);
                        code += ' '.repeat(4 * identation) + '});\n'
                        break;
                    case 'setter':
                        code += ' '.repeat(4 * identation) + element.name + " = " + element.value + ";\n";
                        /*switch (element.type) {
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
                        }*/
                        break;
                    case 'if':
                        code += ' '.repeat(4 * identation) + 'if (' + element.condition + ') {\n';
                        code += self.build(identation + 1, element.content);
                        code += ' '.repeat(4 * identation) + '}\n'
                        break;
                    case 'else':
                        code += ' '.repeat(4 * identation) + 'else {\n';
                        code += self.build(identation + 1, element.content);
                        code += ' '.repeat(4 * identation) + '}\n'
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
        code += self.build(0, self._global);
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

    self.init(html, options);
    return self;
}

module.exports = Interpreter;