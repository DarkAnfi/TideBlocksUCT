import React, { Component } from 'react';
import './Droppable.css';
const { $ } = window;

class Droppable extends Component {
    componentDidMount() {
        this.$node = $(this.refs.droppable);
        this.$node.droppable(
            {
                accept: "[data-block='operator'], [data-block='value']",
                drop: this.props.app.drop,
                greedy: true,
                tolerance: 'pointer'
            }
        ).disableSelection();
    }

    shouldComponentUpdate() { return false; }

    render() {
        return (
            <div className="value-slot" ref="droppable">
                {this.props.children}
            </div>
        );
    }
}

export default Droppable;