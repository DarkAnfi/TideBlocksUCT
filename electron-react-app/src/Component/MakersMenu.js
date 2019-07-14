import React from 'react';
import BlockMenu from "./BlockMenu";
import Block from "./Block";

class MakersMenu extends React.Component {


    render() {
        return (
            <BlockMenu className="MakersMenu" color="primary" title="Makers">
                <Block color="primary" data-block="led-on" locked content={
                    [
                        "Encender LED",
                        <select className="form-control input-sm" defaultValue="13">
                            <option value="13">Blanco</option>
                            <option value="6">Rojo</option>
                            <option value="5">Amarillo</option>
                            <option value="4">Verde</option>
                        </select>
                    ]
                } />
                <Block color="primary" data-block="led-off" locked content={
                    [
                        "Apagar LED",
                        <select className="form-control input-sm" defaultValue="13">
                            <option value="13">Blanco</option>
                            <option value="6">Rojo</option>
                            <option value="5">Amarillo</option>
                            <option value="4">Verde</option>
                        </select>
                    ]
                } />
                <Block color="primary" data-block="servo1" locked content={
                    [
                        "Servo 1",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="0" />
                        </div>
                    ]
                } />
                <Block color="primary" data-block="servo2" locked content={
                    [
                        "Servo 2",
                        <div className="value-slot">
                            <input className="form-control input-sm" defaultValue="0" />
                        </div>
                    ]
                } />
            </BlockMenu>
        );
    }
}

export default MakersMenu;