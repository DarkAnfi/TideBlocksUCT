import React from 'react';
import BlockMenu from "./BlockMenu";
import Block from './Block';
import Droppable from './Droppable';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Row,
    Col,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import Draggable from './Draggable';
const { $ } = window;

class VariablesMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
        this.handlerCreateVariable = this.handlerCreateVariable.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    handlerCreateVariable() {
        const { project } = this.props.app;
        const { type, name } = this.refs;
        if (name.refs.entry.value.replace(/ /g, '') !== '') {
            project.variables[name.refs.entry.value] = type.refs.entry.value;
            $('select.variableList').html('')
            Object.keys(project.variables).forEach(
                value => $('select.variableList')
                    .append($(document.createElement('option'))
                        .text(value)
                    )
            )

            $('[data-block] select').trigger('change');
            this.props.app.set(
                { project },
                () => this.toggle()
            )
        }
    }

    toggle() {
        this.setState(
            {
                modal: !this.state.modal
            }
        );
    }

    render() {
        const { variables } = this.props.app.project;
        return (
            <BlockMenu ref="BlockMenu" className="VariablesMenu" color="danger" title="Variables" onToggle={this.props.onToggle}>
                <Button className="mb-2" onClick={this.toggle}>Crear variable</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Crear variable</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Row>
                                <Col xs="4">
                                    <FormGroup>
                                        <Label>Tipo</Label>
                                        <Input type="select" ref="type" innerRef="entry">
                                            <option value="int">Entero</option>
                                            <option value="float">Decimal</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col xs="8">
                                    <FormGroup>
                                        <Label>Nombre</Label>
                                        <Input type="text" ref="name" innerRef="entry" />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancelar</Button>{' '}
                        <Button color="primary" onClick={this.handlerCreateVariable}>Aceptar</Button>
                    </ModalFooter>
                </Modal>
                {
                    Object.keys(variables).map(
                        (value, index) => <Draggable app={this.props.app} key={index} data-block="value" data-name={value} color="danger" content={[value]} />
                    )
                }
                <Block app={this.props.app} color="danger" data-block="setter" locked content={
                    [
                        <select className="variableList form-control input-sm" />,
                        "=",
                        <Droppable app={this.props.app}>
                            <input className="form-control input-sm" defaultValue="0" />
                        </Droppable>
                    ]
                } />
            </BlockMenu>
        );
    }
}

export default VariablesMenu;