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
        this.handlerToggle = this.handlerToggle.bind(this);
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
            const { ControlsMenu, OperatorsMenu, MenuVariables, MakersMenu } = this.refs;
            if ("ControlsMenu" !== event.component.props.className) {
                ControlsMenu.refs.BlockMenu.setState({ collapse: false })
            }
            if ("OperatorsMenu" !== event.component.props.className) {
                OperatorsMenu.refs.BlockMenu.setState({ collapse: false })
            }
            if ("VariablesMenu" !== event.component.props.className) {
                MenuVariables.refs.BlockMenu.setState({ collapse: false })
            }
            if ("MakersMenu" !== event.component.props.className) {
                MakersMenu.refs.BlockMenu.setState({ collapse: false })
            }
        }
    }

    render() {
        return (
            <Container fluid className="LeftContent">
                <h2>CTBlocks</h2>
                <Scrollbar color="secondary">
                    <ControlsMenu app={this.props.app} ref="ControlsMenu" onToggle={this.handlerToggle} />
                    <OperatorsMenu app={this.props.app} ref="OperatorsMenu" onToggle={this.handlerToggle} />
                    <VariablesMenu app={this.props.app} ref="MenuVariables" onToggle={this.handlerToggle} />
                    <MakersMenu app={this.props.app} ref="MakersMenu" onToggle={this.handlerToggle} />
                </Scrollbar>
            </Container>
        );
    }
}

export default LeftContent;