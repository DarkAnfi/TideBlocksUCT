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
    }

    serialportList(event) {
        event.preventDefault();
        const { ipcRenderer } = this.props.app.electron;
        ipcRenderer.send('serialport:list');
        event.stopPropagation();
    }

    render() {
        return (
            <Container fluid className="LeftContent">
                <h2>TIDE Blocks</h2>
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
                </Form>
                <Scrollbar color="secondary">
                    <ControlsMenu app={this.props.app} />
                    <OperatorsMenu app={this.props.app} />
                    <VariablesMenu app={this.props.app} />
                    <SensorsMenu app={this.props.app} />
                    <MakersMenu app={this.props.app} />
                </Scrollbar>
            </Container>
        );
    }
}

export default LeftContent;