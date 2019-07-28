import React, { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Input,
  Form,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import logo from './media/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCogs,
  faFile,
  faFolderOpen,
  faSave
} from '@fortawesome/free-solid-svg-icons'
import { prepare, getCode } from '../Classes/Interpreter';
import html2json from 'html-to-json';
import LinkedListNode from '../Classes/LinkedListNode';
import './Header.css';
const { $ } = window;

class Header extends Component {
  constructor(props) {
    super(props);
    this.handlerWindowMinimize = this.handlerWindowMinimize.bind(this);
    this.handlerWindowMaximize = this.handlerWindowMaximize.bind(this);
    this.handlerWindowRestore = this.handlerWindowRestore.bind(this);
    this.handlerWindowClose = this.handlerWindowClose.bind(this);
    this.handlerNew = this.handlerNew.bind(this);
    this.handlerOpen = this.handlerOpen.bind(this);
    this.handlerSave = this.handlerSave.bind(this);
    this.handlerSaveAs = this.handlerSaveAs.bind(this);
    this.handlerExport = this.handlerExport.bind(this);
    this.handlerCompile = this.handlerCompile.bind(this);
  }

  handlerWindowMinimize(event) {
    event.preventDefault();
    const { ipcRenderer } = this.props.app.electron;
    ipcRenderer.send('mainWindow:minimize');
    event.stopPropagation();
  }

  handlerWindowMaximize(event) {
    event.preventDefault();
    const { ipcRenderer } = this.props.app.electron;
    ipcRenderer.send('mainWindow:maximize');
    event.stopPropagation();
  }

  handlerWindowRestore(event) {
    event.preventDefault();
    const { ipcRenderer } = this.props.app.electron;
    ipcRenderer.send('mainWindow:restore');
    event.stopPropagation();
  }

  handlerWindowClose(event) {
    event.preventDefault();
    const { ipcRenderer } = this.props.app.electron;
    ipcRenderer.send('mainWindow:close');
    event.stopPropagation();
  }

  handlerNew(event) {
    event.preventDefault();
    const { app } = this.props;
    const { project } = app;
    if (project.savedState === project.currentState.data) {
      $("#workspace").html('');
      this.refs.projectName.refs.entry.value = "Nuevo Projecto"
      const newProject = {
        filename: null,
        imports: ["Servo.h"],
        defaults: [
          { block: 'execute', command: 'Servo SERVO1' },
          { block: 'execute', command: 'Servo SERVO2' }
        ],
        setup: [
          { block: 'execute', command: 'pinMode(4, OUTPUT)' },
          { block: 'execute', command: 'pinMode(5, OUTPUT)' },
          { block: 'execute', command: 'pinMode(6, OUTPUT)' },
          { block: 'execute', command: 'pinMode(13, OUTPUT)' },
          { block: 'execute', command: 'SERVO1.attach(12)' },
          { block: 'execute', command: 'SERVO2.attach(11)' }
        ],
        loop: [],
        variables: {},
        savedState: $("#workspace")[0].outerHTML,
        currentState: new LinkedListNode($("#workspace")[0].outerHTML)
      }
      this.props.app.set(
        { project: newProject }
      );
    }
    event.stopPropagation();
  }

  handlerOpen(event) {
    event.preventDefault();
    const { ipcRenderer } = this.props.app.electron;
    ipcRenderer.send('fs:open')
    event.stopPropagation();
  }

  handlerSave(event) {
    event.preventDefault();
    const { app } = this.props;
    const { project, electron } = app;
    const { ipcRenderer } = electron;
    const path = electron.remote.require('path');
    project.savedState = project.currentState.data;
    app.set(
      { project },
      () => {
        if (project.filename) {
          const newFilename = path.join(path.dirname(project.filename.toString()), this.refs.projectName.refs.entry.value + ".ctb");
          console.log(project.filename, path.dirname(project.filename), path.dirname("C:\\Users\\aflores\\Desktop\\Nuevo Proyecto.ctb"));
          ipcRenderer.send('fs:save', newFilename, {
            imports: project.imports,
            defaults: project.defaults,
            setup: project.setup,
            variables: project.variables,
            savedState: project.savedState
          });
        } else {
          const newFilename = this.refs.projectName.refs.entry.value + ".ctb";
          console.log(project.filename, newFilename);
          ipcRenderer.send('fs:saveas', newFilename, {
            imports: project.imports,
            defaults: project.defaults,
            setup: project.setup,
            variables: project.variables,
            savedState: project.savedState
          });
        }
      }
    );
    event.stopPropagation();
  }

  handlerSaveAs(event) {
    event.preventDefault();
    const { app } = this.props;
    const { project, electron } = app;
    const { ipcRenderer } = electron;
    const path = electron.remote.require('path');
    project.savedState = project.currentState.data;
    app.set(
      { project },
      () => {
        if (project.filename) {
          const newFilename = path.join(path.dirname(project.filename.toString()), this.refs.projectName.refs.entry.value + ".ctb");
          ipcRenderer.send('fs:saveas', newFilename, {
            imports: project.imports,
            defaults: project.defaults,
            setup: project.setup,
            variables: project.variables,
            savedState: project.savedState
          });
        } else {
          const newFilename = this.refs.projectName.refs.entry.value + ".ctb";
          console.log(project.filename, newFilename);
          ipcRenderer.send('fs:saveas', newFilename, {
            imports: project.imports,
            defaults: project.defaults,
            setup: project.setup,
            variables: project.variables,
            savedState: project.savedState
          });
        }
      }
    );
    event.stopPropagation();
  }

  handlerExport(event) {
    event.preventDefault();
    const { project } = this.props.app
    html2json.parse(project.currentState.data, (data) => {
      if (data.length) {
        if (data[0].children.length) {
          if (data[0].children[0].children.length) {
            project.loop = prepare(data[0].children[0].children);
            this.props.app.set({ project });
            const { imports, defaults, variables, setup, loop } = project;
            const txCode = getCode(imports, defaults, variables, setup, loop);
            console.log(txCode);
          }
        }
      }
    });
    event.stopPropagation();
  }

  handlerCompile(event) {
    event.preventDefault();
    const { project, electron } = this.props.app
    const { ipcRenderer } = electron;
    html2json.parse(project.currentState.data, (data) => {
      if (data.length) {
        if (data[0].children.length) {
          if (data[0].children[0].children.length) {
            project.loop = prepare(data[0].children[0].children);
            this.props.app.set({ project });
            const { imports, defaults, variables, setup, loop } = project;
            const txCode = getCode(imports, defaults, variables, setup, loop);
            ipcRenderer.send('compiler:send', txCode, 'COM3');
          }
        }
      }
    });
    event.stopPropagation();
  }

  render() {
    return (
      <div className="Header" >
        <Navbar className="window" dark expand="md">
          <Nav className="mr-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Archivo</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.handlerNew}>Nuevo</DropdownItem>
                <DropdownItem onClick={this.handlerOpen}>Abrir</DropdownItem>
                <DropdownItem onClick={this.handlerSave}>Guardar</DropdownItem>
                <DropdownItem onClick={this.handlerSaveAs}>Guardar Como</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.handlerExport}>Exportar</DropdownItem>
                <DropdownItem onClick={this.handlerCompile}>Compilar</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={this.handlerWindowClose}>Salir</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="#">Edit</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">View</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Help</NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem className="window-control">
              <NavLink onClick={this.handlerWindowMinimize}>
                <svg aria-hidden="true" version="1.1" width="10" height="10">
                  <path fill="currentColor" d="M 0,5 10,5 10,6 0,6 Z" />
                </svg>
              </NavLink>
            </NavItem>
            <NavItem className="window-control">
              <NavLink onClick={this.props.app.isMaximized ? this.handlerWindowRestore : this.handlerWindowMaximize}>
                {
                  this.props.app.isMaximized ?
                    <svg aria-hidden="true" version="1.1" width="10" height="10">
                      <path fill="currentColor" d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z" />
                    </svg>
                    :
                    <svg aria-hidden="true" version="1.1" width="10" height="10">
                      <path fill="currentColor" d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
                    </svg>
                }
              </NavLink>
            </NavItem>
            <NavItem className="window-control">
              <NavLink className="window-close" onClick={this.handlerWindowClose}>
                <svg aria-hidden="true" version="1.1" width="10" height="10">
                  <path fill="currentColor" d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
                </svg>
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <img src={logo} className="logo mr-sm-2" alt="logo" />
                <Input defaultValue="Nuevo Proyecto" ref="projectName" innerRef="entry" />
              </FormGroup>
            </Form>
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink onClick={this.handlerNew} href="#"><FontAwesomeIcon icon={faFile} /> Nuevo</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handlerOpen} href="#"><FontAwesomeIcon icon={faFolderOpen} /> Abrir</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handlerSave} href="#"><FontAwesomeIcon icon={faSave} /> Guardar</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.handlerCompile} href="#" ><FontAwesomeIcon icon={faCogs} /> Compilar</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
export default Header;