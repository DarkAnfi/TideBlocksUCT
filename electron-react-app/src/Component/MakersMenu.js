import React from 'react';
import BlockMenu from "./BlockMenu";
import Block from "./Block";
import Droppable from './Droppable';
import Draggable from './Draggable';

class MakersMenu extends React.Component {

    render() {
        return (
            <BlockMenu ref="BlockMenu" className="MakersMenu" color="primary" title="Makers" onToggle={this.props.onToggle}>
                <Block app={this.props.app} color="primary" data-block="led-on" locked content={
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
                <Block app={this.props.app} color="primary" data-block="led-off" locked content={
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
                <Block app={this.props.app} color="primary" data-block="servo1" locked content={
                    [
                        "Servo 1",
                        <Droppable app={this.props.app} defaultValue="90" min="0" max="180">
                            <input className="form-control input-sm" defaultValue="90" />
                        </Droppable>
                    ]
                } />
                <Block app={this.props.app} color="primary" data-block="servo2" locked content={
                    [
                        "Servo 2",
                        <Droppable app={this.props.app} defaultValue="90" min="0" max="180">
                            <input className="form-control input-sm" defaultValue="90" />
                        </Droppable>
                    ]
                } />
                <Block app={this.props.app} color="primary" data-block="continue1" locked content={
                    [
                        "Servo Continuo 1",
                        <Droppable app={this.props.app} defaultValue="0" min="-100" max="100">
                            <input className="form-control input-sm" defaultValue="0" />
                        </Droppable>
                    ]
                } />
                <Block app={this.props.app} color="primary" data-block="continue2" locked content={
                    [
                        "Servo Continuo 2",
                        <Droppable app={this.props.app} defaultValue="0" min="-100" max="100">
                            <input className="form-control input-sm" defaultValue="0" />
                        </Droppable>
                    ]
                } />
                <Block app={this.props.app} color="primary" data-block="pwda" locked content={
                    [
                        "Puerto A",
                        <Droppable app={this.props.app} defaultValue="0" min="0" max="100">
                            <input className="form-control input-sm" defaultValue="0" />
                        </Droppable>
                    ]
                } />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(3)" color="primary" content={[
                    "Sensor de Sonido"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(4)" color="primary" content={[
                    "Sensor de Luz"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(5)" color="primary" content={[
                    "Sensor de Temperatura"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="GETA()" color="primary" content={[
                    "Puerto Digital A"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(0)" color="primary" content={[
                    "Puerto Análogo B"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(1)" color="primary" content={[
                    "Puerto Análogo C"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(2)" color="primary" content={[
                    "Puerto Análogo D"
                ]} />
                <Block app={this.props.app} color="primary" data-block="monitorear" locked content={
                    [
                        "Monitorear",
                        <Droppable app={this.props.app} defaultValue="0">
                            <input className="form-control input-sm" defaultValue="0" />
                        </Droppable>,
                        "Nombre",
                        <input className="form-control input-sm String" defaultValue="nombre"/>
                    ]
                } />
            </BlockMenu>
        );
    }
}

export default MakersMenu;