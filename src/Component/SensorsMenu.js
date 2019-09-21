import React from 'react';
import BlockMenu from "./BlockMenu";
import Draggable from './Draggable';

class SensorsMenu extends React.Component {


    render() {
        return (
            <BlockMenu ref="BlockMenu" className="SensorsMenu" color="info" title="Sensores" onToggle={this.props.onToggle}>
                
            </BlockMenu>
        );
    }
}

export default SensorsMenu;