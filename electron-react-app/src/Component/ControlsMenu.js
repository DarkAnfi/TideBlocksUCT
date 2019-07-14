import React from 'react';
import BlockMenu from "./BlockMenu";
import Block from './Block';

class ControlsMenu extends React.Component {
    render() {
        return (
            <BlockMenu className="ControlsMenu" color="warning" title="Contról">
                <Block color="warning" data-block="if" content={
                    [
                        "Si",
                        <div class="value-slot">
                            <input class="form-control input-sm" value="1" />
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
                        <div class="value-slot">
                            <input class="form-control input-sm" value="1" />
                        </div>
                    ]
                } />
                <Block color="warning" data-block="repeat" content={
                    [
                        "Repetir",
                        <div class="value-slot">
                            <input class="form-control input-sm" value="1" />
                        </div>,
                        "veces"
                    ]
                } />
                <Block color="warning" data-block="delay" locked content={
                    [
                        "Esperar",
                        <div class="value-slot">
                            <input class="form-control input-sm" value="1000" />
                        </div>
                    ]
                } />

                <Block color="warning" data-block="delay" locked content={
                    [
                        <select class="variableList form-control input-sm" value="_NULL">
                            <option value="_NULL" selected>Variable</option>
                        </select>,
                        "=",
                        <div class="value-slot">
                            <input class="form-control input-sm" value="1000" />
                        </div>
                    ]
                } />
            </BlockMenu>
        );
    }
}

export default ControlsMenu;