import React from 'react';
import BlockMenu from "./BlockMenu";
import Block from './Block';

class ControlsMenu extends React.Component {
    render() {
        return (
            <BlockMenu className="ControlsMenu" color="warning" title="Controles">
                <Block color="warning" data-block="if" content={
                    [
                        "Si",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="1" />
                        </div>,
                        "entonces"
                    ]
                } />
                <Block color="warning" data-block="else" content={
                    [
                        "De lo contrario entonces"
                    ]
                } />
                <Block color="warning" data-block="while" content={
                    [
                        "Repetir mientras",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="1" />
                        </div>
                    ]
                } />
                <Block color="warning" data-block="repeat" content={
                    [
                        "Repetir",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="1" />
                        </div>,
                        "veces"
                    ]
                } />
                <Block color="warning" data-block="delay" locked content={
                    [
                        "Esperar",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="1000" />
                        </div>
                    ]
                } />

                <Block color="warning" data-block="delay" locked content={
                    [
                        <select className="variableList form-control input-sm" defaultValue="_NULL">
                            <option value="_NULL">Variable</option>
                        </select>,
                        "=",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="1000" />
                        </div>
                    ]
                } />
            </BlockMenu>
        );
    }
}

export default ControlsMenu;