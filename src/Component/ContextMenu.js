import React from 'react';
import {
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import './ContextMenu.css'

class VariablesMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            x: 0,
            y: 0,
            options: []
        }
        this.toggle = this.toggle.bind(this);
        this.getOption = this.getOption.bind(this);
        this.getOptions = this.getOptions.bind(this);
    }

    toggle() {
        this.setState(
            {
                isOpen: !this.state.isOpen
            }
        );
    }

    getOption(value, index) {
        return (
            <ListGroupItem key={index} action onClick={value.lamda} >{value.label}</ListGroupItem>
        );
    }

    getOptions() {
        const { options } = this.state;
        return options.map(this.getOption);
    }

    render() {
        return (
            <ListGroup className="ContextMenu" style={
                {
                    display: this.state.isOpen ? 'block' : 'none',
                    left: this.state.x,
                    top: this.state.y
                }
            }>
                {this.getOptions()}
            </ListGroup>
        );
    }
}

export default VariablesMenu;