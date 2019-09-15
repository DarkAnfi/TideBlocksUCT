import React from 'react';
import BlockMenu from "./BlockMenu";
import Draggable from './Draggable';
import Droppable from './Droppable';

class OperatorsMenu extends React.Component {


    render() {
        return (
            <BlockMenu ref="BlockMenu" className="OperatorsMenu" color="success" title="Operadores" onToggle={this.props.onToggle}>
                <Draggable app={this.props.app} data-block="value" operator operation="+" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;+&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="-" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;-&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="*" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;&times;&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="/" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;/&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="<" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;&lt;&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="<=" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;&le;&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="==" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;=&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="!=" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;&ne;&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation=">" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;&gt;&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation=">=" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;&ge;&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation={"&&"} color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;y&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
                <Draggable app={this.props.app} data-block="value" operator operation="||" color="success" content={[
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>,
                    <span>&nbsp;o&nbsp;</span>,
                    <Droppable app={this.props.app}>
                        <input className="form-control input-sm" defaultValue="0" />
                    </Droppable>
                ]} />
            </BlockMenu>
        );
    }
}

export default OperatorsMenu;