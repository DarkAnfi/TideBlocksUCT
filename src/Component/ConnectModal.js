import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUsb
} from '@fortawesome/free-brands-svg-icons';
import {
    NavLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';

class ConnectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
        this.open = this.open.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.update = this.update.bind(this);
    }

    open() {
        this.update();
        this.toggle();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    submit(event) {
        event.preventDefault();
        this.props.app.set(
            {
                currentPort: this.refs.port.refs.entry.value
            }
        );
        this.toggle();
        event.stopPropagation();
    }

    update() {
        const { ipcRenderer } = this.props.app.electron;
        ipcRenderer.send('serialport:list');
    }

    render() {
        return (
            <div>
                <NavLink onClick={this.open} href="#"><FontAwesomeIcon icon={faUsb} /> Conectar</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Conectar</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.submit}>
                            <FormGroup>
                                <Label>Puerto</Label>
                                <Input type="select" bsSize="sm" ref="port" innerRef="entry">
                                    {
                                        this.props.app.ports.map(
                                            (value, index) => <option key={index} value={value.comName}>{value.comName}{value.manufacturer ? ": " + value.manufacturer : ""}</option>
                                        )
                                    }
                                </Input>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                        <Button color="primary" onClick={this.submit}>Aceptar</Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ConnectModal;