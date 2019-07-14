import React from 'react';
import { Container } from 'reactstrap';
import Scrollbar from './Scrollbar';
import VariablesMenu from './VariablesMenu';
import ControlsMenu from './ControlsMenu';
import SensorsMenu from './SensorsMenu';
import MakersMenu from './MakersMenu';
import './LeftContent.css';

class LeftContent extends React.Component {

    render() {
        return (
            <Container fluid className="LeftContent">
                <h2>TIDE Blocks</h2>
                <Scrollbar color="primary" maxHeight="calc(100vh - 56px - 15px - 38px - 8px - 15px)">
                    <ControlsMenu />
                    <SensorsMenu />
                    <VariablesMenu />
                    <MakersMenu />
                </Scrollbar>
            </Container>
        );
    }
}

export default LeftContent;