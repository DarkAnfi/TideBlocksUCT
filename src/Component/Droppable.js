import React, { Component } from 'react';
import './Droppable.css';
const { $ } = window;

class Droppable extends Component {
    componentDidMount() {
        this.$node = $(this.refs.droppable);
        this.$node.droppable(
            {
                accept: function (draggable) {
                    if (draggable.is("[data-block='operator'], [data-block='value']")) {
                        return $(this).parents('.LeftContent').length === 0
                    }
                    return false
                },
                drop: this.props.app.drop,
                greedy: true,
                tolerance: 'pointer'
            }
        ).disableSelection();
    }

    shouldComponentUpdate() { return false; }

    render() {
        return (
            <div className="value-slot" ref="droppable" min={this.props.min} max={this.props.max}>
                {this.props.children}
            </div>
        );
    }
}

export default Droppable;