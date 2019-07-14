import React, { Component } from 'react';
import './Block.css';
const { $ } = window;

class Block extends Component {
    isAllowed(placeholder, placeholderParent, currentItem) {
        if (placeholderParent) {
            if (placeholderParent.hasClass('locked')) {
                return false;
            } else {
                if (currentItem.attr('data-block') === "else") {
                    if (placeholder.prev().attr('data-block') !== "if") {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (placeholder.next().attr('data-block') === "else") {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        } else {
            if (currentItem.attr('data-block') === "else") {
                if (placeholder.prev().attr('data-block') !== "if") {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (placeholder.next().attr('data-block') === "else") {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    remove(event, ui) {
        const item = $(ui.item.clone());
        /*
        item.find(".value-slot").droppable(
            {
                accept: "div[data-block='value']",
                drop: valueSlotDrop
            }
        );
        item.on('click', handlerBlockClick);
        item.find('input, select')
            .on('change', handlerUpdateArgs)
            .on('keypress', handlerUpdateArgs);
            */
        $(this).html(item);
    }

    componentDidMount() {
        this.$node = $(this.refs.nestedSortable);
        this.$node.nestedSortable(
            {
                listType: 'ul',
                handle: 'div',
                items: 'li',
                toleranceElement: '> div',
                isAllowed: this.isAllowed,
                connectWith: ".sortable",
                remove: this.remove
            }
        );
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