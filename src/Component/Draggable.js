import React, { Component } from 'react';
import './Draggable.css';
const { $ } = window;

class Draggable extends Component {
    componentDidMount() {
        this.$node = $(this.refs.draggable);
        this.$node.draggable(
            {
                helper: "clone",
                scroll: false,
                zIndex: 100,
                stop: this.props.app.stop
            }
        ).disableSelection();
    }

    shouldComponentUpdate() { return false; }

    render() {
        return (
            <div className="value-container">
                <div ref="draggable" data-block={this.props['data-block'] ? this.props['data-block'] : 'undefined'} data-name={this.props['data-name'] ? this.props['data-name'] : this.props.operator?'0/*operator*/':'unnamed'} color={this.props.color ? this.props.color : "secondary"} className={this.props.operator ? 'operator' : ''} operation={this.props.operation?this.props.operation:'+'}>
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    {
                                        this.props.content ?
                                            this.props.content.map((value, index) => <td key={index}>{value}</td>)
                                            :
                                            null
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Draggable;