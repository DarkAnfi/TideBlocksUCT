import React from 'react';
import BlockMenu from "./BlockMenu";
import Block from './Block';
import Droppable from './Droppable';

class ControlsMenu extends React.Component {
    render() {
        return (
            <BlockMenu ref="BlockMenu" className="ControlsMenu" color="warning" title="Controles" onToggle={this.props.onToggle}>
                <Block app={this.props.app} color="warning" data-block="if" content={
                    [
                        "Si",
                        <Droppable app={this.props.app}>
                            <input className="form-control input-sm" defaultValue="1" />
                        </Droppable>
                    ]
                } />
                <Block app={this.props.app} color="warning" data-block="else" content={
                    [
                        "Si no"
                    ]
                } />
                <Block app={this.props.app} color="warning" data-block="while" content={
                    [
                        "Repetir mientras",
                        <Droppable app={this.props.app}>
                            <input className="form-control input-sm" defaultValue="1" />
                        </Droppable>
                    ]
                } />
                <Block app={this.props.app} color="warning" data-block="repeat" content={
                    [
                        "Repetir",
                        <Droppable app={this.props.app}>
                            <input className="form-control input-sm" defaultValue="1" />
                        </Droppable>,
                        "veces"
                    ]
                } />
                <Block app={this.props.app} color="warning" data-block="delay" locked content={
                    [
                        "Esperar",
                        <Droppable app={this.props.app}>
                            <input className="form-control input-sm" defaultValue="1000" />
                        </Droppable>
                    ]
                } />
            </BlockMenu>
        );
    }
}

export default ControlsMenu;