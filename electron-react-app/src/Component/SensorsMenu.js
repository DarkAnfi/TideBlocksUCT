import React from 'react';
import BlockMenu from "./BlockMenu";
import Draggable from './Draggable';

class SensorsMenu extends React.Component {


    render() {
        return (
            <BlockMenu ref="BlockMenu" className="SensorsMenu" color="info" title="Sensores" onToggle={this.props.onToggle}>
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(3)" color="info" content={[
                    "Sensor de Sonido"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(4)" color="info" content={[
                    "Sensor de Luz"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(5)" color="info" content={[
                    "Sensor de Temperatura"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="digitalRead(3)" color="info" content={[
                    "Puerto Digital A"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(0)" color="info" content={[
                    "Puerto Análogo B"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(1)" color="info" content={[
                    "Puerto Análogo C"
                ]} />
                <Draggable app={this.props.app} data-block="value" data-name="analogRead(2)" color="info" content={[
                    "Puerto Análogo D"
                ]} />
            </BlockMenu>
        );
    }
}

export default SensorsMenu;