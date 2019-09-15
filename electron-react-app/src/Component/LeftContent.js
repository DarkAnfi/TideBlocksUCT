import React from 'react';
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import Scrollbar from './Scrollbar';
import VariablesMenu from './VariablesMenu';
import ControlsMenu from './ControlsMenu';
import SensorsMenu from './SensorsMenu';
import MakersMenu from './MakersMenu';
import OperatorsMenu from './OperatorsMenu';
import './LeftContent.css';

class LeftContent extends React.Component {
    constructor(props) {
        super(props);
        this.serialportList = this.serialportList.bind(this);
        this.handlerToggle = this.handlerToggle.bind(this)
    }

    serialportList(event) {
        event.preventDefault();
        const { ipcRenderer } = this.props.app.electron;
        ipcRenderer.send('serialport:list');
        this.props.app.set({
            currentPort: event.currentTarget.value
        });
        event.stopPropagation();
    }

    handlerToggle(event) {
        if (event.state.collapse) {
            const { ControlsMenu, OperatorsMenu, MenuVariables, SensorsMenu, MakersMenu } = this.refs;
            if (ControlsMenu.constructor.name !== event.component.props.className) {
                ControlsMenu.refs.BlockMenu.setState({collapse:false})
            }
            if (OperatorsMenu.constructor.name !== event.component.props.className) {
                OperatorsMenu.refs.BlockMenu.setState({collapse:false})
            }
            if (MenuVariables.constructor.name !== event.component.props.className) {
                MenuVariables.refs.BlockMenu.setState({collapse:false})
            }
            if (SensorsMenu.constructor.name !== event.component.props.className) {
                SensorsMenu.refs.BlockMenu.setState({collapse:false})
            }
            if (MakersMenu.constructor.name !== event.component.props.className) {
                MakersMenu.refs.BlockMenu.setState({collapse:false})
            }
        }
    }

    render() {
        return (
            <Container fluid className="LeftContent">
                <h2>CTBlocks</h2>
                {/*
                <Form>
                    <FormGroup>
                        <Label>Puerto</Label>
                        <Input type="select" bsSize="sm" onInput={this.serialportList} onClick={this.serialportList} onChange={this.serialportList}>
                            {
                                this.props.app.ports.map(
                                    (value, index) => <option key={index} value={value.comName}>{value.comName}{value.manufacturer ? ": " + value.manufacturer : ""}</option>
                                )
                            }
                        </Input>
                    </FormGroup>
                        </Form>*/}
                <Scrollbar color="secondary">
                    <ControlsMenu app={this.props.app} ref="ControlsMenu" onToggle={this.handlerToggle} />
                    <OperatorsMenu app={this.props.app} ref="OperatorsMenu" onToggle={this.handlerToggle} />
                    <VariablesMenu app={this.props.app} ref="MenuVariables" onToggle={this.handlerToggle} />
                    <SensorsMenu app={this.props.app} ref="SensorsMenu" onToggle={this.handlerToggle} />
                    <MakersMenu app={this.props.app} ref="MakersMenu" onToggle={this.handlerToggle} />
                </Scrollbar>
            </Container>
        );
    }
}

export default LeftContent;