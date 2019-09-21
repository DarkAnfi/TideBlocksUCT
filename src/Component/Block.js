import React, { Component } from 'react';
import './Block.css';
const { $ } = window;

class Block extends Component {
    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
    }

    remove(event, ui) {
        const item = $(ui.item.clone());
        item.find(".value-slot").droppable(
            {
                accept: "[data-block='operator'], [data-block='value']",
                drop: this.props.app.drop,
                greedy: true,
                tolerance: 'pointer'
            }
        ).disableSelection();
        $(event.target).html(item);
    }

    componentDidMount() {
        this.$node = $(this.refs.nestedSortable);
        this.$node.nestedSortable(
            {
                listType: 'ul',
                handle: 'div',
                items: 'li',
                toleranceElement: '> div',
                isAllowed: this.props.app.isAllowed,
                connectWith: ".sortable",
                remove: this.remove,
                stop: this.props.app.stop,
                start: this.props.app.start,
                update: this.props.app.update
            }
        ).disableSelection();
    }

    shouldComponentUpdate() { return false; }

    componentWillReceiveProps(nextProps) {
        if (nextProps.enable !== this.props.enable)
            this.$node.nestedSortable(nextProps.enable ? 'enable' : 'disable');
    }

    render() {
        return (
            <ul className="block-container" ref="nestedSortable">
                <li data-block={this.props['data-block'] ? this.props['data-block'] : 'undefined'} className={this.props.locked ? 'locked' : 'unlocked'} color={this.props.color ? this.props.color : "default"}>
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
                </li>
            </ul>
        );
    }

    componentWillUnmount() {
        this.$node.nestedSortable('destroy');
    }
}

export default Block;