function prepare(html) {
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
                        args: [elements[0].name === "select" ?
                            (elements[0].attribs['data-value'] ? elements[0].attribs['data-value'] : 13)
                            :
                            (elements[0].attribs["data-block"] === "value" ? elements[0].attribs["data-name"] : 13), 'HIGH']
                    });
                    break;
                case 'led-off':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'digitalWrite',
                        args: [elements[0].name === "select" ?
                            (elements[0].attribs['data-value'] ? elements[0].attribs['data-value'] : 13)
                            :
                            (elements[0].attribs["data-block"] === "value" ? elements[0].attribs["data-name"] : 13), 'LOW']
                    });
                    break;
                case 'delay':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'delay',
                        args: [getValue(elements[0], 1000)]
                    });
                    break;
                case 'if':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'if',
                        condition: getValue(elements[0], 1),
                        content: e1.children[1] ? prepare(e1.children[1].children) : []
                    });
                    break;
                case 'else':
                    tree.push({
                        block: 'else',
                        content: e1.children[1] ? prepare(e1.children[1].children) : []
                    });
                    break;
                case 'servo1':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'SERVO1.write',
                        args: [getValue(elements[0], 0)]
                    });
                    break;
                case 'servo2':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'SERVO2.write',
                        args: [getValue(elements[0], 0)]
                    });
                    break;
                case 'continue1':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'SERVO1.write',
                        args: ['(int)((float)(' + getValue(elements[0], 0) + '+100.0)/200.0*180.0)']
                    });
                    break;
                case 'continue2':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'SERVO2.write',
                        args: ['(int)((float)(' + getValue(elements[0], 0) + '+100.0)/200.0*180.0)']
                    });
                    break;
                case 'pwda':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'callFunction',
                        name: 'SETA',
                        args: [getValue(elements[0], 0)]
                    });
                    break;
                case 'monitorear':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    elements[1] = e1.children[0].children[0].children[0].children[0].children[3].children[0];
                    console.log(elements[1])
                    tree.push({
                        block: 'callFunction',
                        name: 'Monitorear',
                        args: ['(float)' + getValue(elements[0], 0), '"' + elements[1].attribs["data-value"] + '"']
                    });
                    break;
                case 'while':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'while',
                        condition: getValue(elements[0], 1),
                        content: e1.children[1] ? prepare(e1.children[1].children) : []
                    });
                    break;
                case 'repeat':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[1].children[0].children[0];
                    tree.push({
                        block: 'repeat',
                        steps: getValue(elements[0], 1),
                        content: e1.children[1] ? prepare(e1.children[1].children) : []
                    });
                    break;
                case 'setter':
                    elements[0] = e1.children[0].children[0].children[0].children[0].children[0].children[0];
                    elements[1] = e1.children[0].children[0].children[0].children[0].children[2].children[0].children[0];
                    tree.push({
                        block: 'setter',
                        name: elements[0].name === "select" ?
                            (elements[0].attribs['data-value'] ? elements[0].attribs['data-value'] : '// unnamed')
                            :
                            (elements[0].attribs["data-block"] === "value" ? elements[0].attribs["data-name"] : '// unnamed'),
                        value: getValue(elements[1], 0),
                    });
                    break;
                default:
                    break;
            }
        }
    });
    return tree
}

function getValue(element, dflt = 0) {
    var elements = {
        0: {},
        1: {},
        2: {}
    };
    if (element.attribs['data-name'] === "0/*operator*/") {
        elements[0] = element.children[0].children[0].children[0].children[0].children[0].children[0].children[0]
        elements[1] = element.children[0].children[0].children[0].children[0].children[1].children[0].children[0]
        elements[2] = element.children[0].children[0].children[0].children[0].children[2].children[0].children[0]
    }
    return (
        element.name === "input" ?
            element.attribs["data-value"] ?
                element.attribs["data-value"]
                :
                dflt
            :
            element.attribs["data-block"] === "value" ?
                element.attribs["data-name"] === "0/*operator*/" ?
                    element.attribs.operation === "/" ?
                        "((float)(" + getValue(elements[0]) + ")/(float)(" + getValue(elements[2]) + "))"
                        :
                        "(" + getValue(elements[0]) + " " + element.attribs.operation + " " + getValue(elements[2]) + ")"
                    :
                    element.attribs["data-name"]
                :
                dflt
    );
}

function build(identation, tree) {
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
                    code += build(identation + 1, element.content);
                    code += ' '.repeat(4 * identation) + '}\n'
                    break;
                case 'repeat':
                    code += ' '.repeat(4 * identation) + 'repeat(' + element.steps + ',[](){\n';
                    code += build(identation + 1, element.content);
                    code += ' '.repeat(4 * identation) + '});\n'
                    break;
                case 'setter':
                    if (element.name !== "// unnamed") {
                        code += ' '.repeat(4 * identation) + element.name + " = " + element.value + ";\n";
                    }
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
                                if (element.value.length === 1) {
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
                    code += build(identation + 1, element.content);
                    code += ' '.repeat(4 * identation) + '}\n'
                    break;
                case 'else':
                    code += ' '.repeat(4 * identation) + 'else {\n';
                    code += build(identation + 1, element.content);
                    code += ' '.repeat(4 * identation) + '}\n'
                    break;
                default:
                    break;
            }
        }
    )
    return code;
}

function getCode(imports, defaults, variables, setup, loop) {
    var code = "";
    imports.forEach(
        value => {
            code += "#include <" + value + ">\n";
        }
    );
    code += "\n"
    code += build(0, defaults);
    Object.keys(variables).forEach(
        key => {
            code += variables[key] + " " + key + ";\n";
        }
    );
    code += "\nvoid SETA(int _out) {\n";
    code += "    pinMode(3, OUTPUT);\n";
    code += "    analogWrite(3, (int)((float)(_out)/100.0*255.0));\n";
    code += "}\n";
    code += "\nint GETA() {\n";
    code += "    pinMode(3, INPUT);\n";
    code += "    return(digitalRead(3));\n";
    code += "}\n";
    code += "\nvoid Monitorear(float _exp, String _name) {\n";
    code += "    int l_name = _name.length() + 1;\n";
    code += "    char c_name[l_name];\n";
    code += "    String s_exp = String(_exp);\n";
    code += "    int l_exp = s_exp.length() + 1;\n";
    code += "    char c_exp[l_exp];\n";
    code += "    _name.toCharArray(c_name, l_name);\n";
    code += "    s_exp.toCharArray(c_exp, l_exp);\n";
    code += "    Serial.write(c_name);\n";
    code += "    Serial.write(':');\n";
    code += "    Serial.write(c_exp);\n";
    code += "    Serial.write(\";\");\n";
    code += "}\n";
    code += "\nvoid repeat(int _NR, void (*_CR)()) {\n";
    code += "    for (int _IR = 0; _IR < _NR; _IR++) {\n";
    code += "        _CR();\n";
    code += "    }\n";
    code += "}\n";
    code += "\nvoid setup() {\n";
    code += build(1, setup);
    code += "}\n";
    code += "\nvoid loop() {\n";
    code += build(1, loop);
    code += "}\n";

    return code;
}

export { prepare };
export { build };
export { getCode };
export { getValue };