import React, { Component } from 'react';
import './Block.css';
import LinkedListNode from '../Classes/LinkedListNode';
const { $ } = window;

class Block extends Component {
    constructor(props) {
        super(props);
        this.valueSlotDrop = this.valueSlotDrop.bind(this);
        this.isAllowed = this.isAllowed.bind(this);
        this.remove = this.remove.bind(this);
    }

    valueSlotDrop(event, ui) {
        const helper = ui.helper.clone().attr('style', null).removeClass('ui-draggable-dragging');
        if (ui.draggable.parent().hasClass('value-slot')) {
            ui.draggable.parent().html("<input class=\"form-control input-sm\"/>")
        }
        ui.helper.remove();
        $(event.target).html(helper);
        $(event.target).find('.ui-draggable').draggable(
            {
                helper: 'original',
                scroll: false,
                revert: 'invalid',
                revertDuration: 0,
                zIndex: 100
            }
        );
        $(event.target).find('.ui-droppable').droppable(
            {
                accept: "[data-block='operator'], [data-block='value']",
                drop: this.valueSlotDrop,
                greedy: true,
                tolerance: 'pointer'
            }
        );
        $('input').trigger('input');
    }

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
        item.find(".value-slot").droppable(
            {
                accept: "[data-block='operator'], [data-block='value']",
                drop: this.valueSlotDrop,
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
                isAllowed: this.isAllowed,
                connectWith: ".sortable",
                remove: this.remove,
                stop: () => {
                    const currentStateData = window.$('#workspace')[0].outerHTML;
                    if (this.props.app.project.currentState.data !== currentStateData) {
                        const nextState = new LinkedListNode(currentStateData);
                        nextState.prev = this.props.app.project.currentState;
                        nextState.prev.next = nextState;
                        const { project } = this.props.app;
                        project.currentState = nextState;
                        this.props.app.set({ project });
                    }
                }
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