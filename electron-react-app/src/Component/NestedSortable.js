import React, { Component } from 'react';

class NestedSortable extends Component {
    componentDidMount() {
        this.$node = window.$(this.refs.nestedSortable);
        this.$node.nestedSortable({
            listType: 'ul',
            handle: 'div',
            items: 'li',
            toleranceElement: '> div',
            cancel: "div[data-block='value'],input,textarea,button,select,option",
            isAllowed: this.props.isAllowed
        });
    }

    shouldComponentUpdate() { return false; }

    componentWillReceiveProps(nextProps) {
        if (nextProps.enable !== this.props.enable)
            this.$node.nestedSortable(nextProps.enable ? 'enable' : 'disable');
    }

    renderItems() {
        return this.props.data.map((item, i) =>
            <li key={i} >
                {item}
            </li>
        );
    }
    render() {
        return (
            <ul ref="nestedSortable">
                { this.props.children}
            </ul>
        );
    }

    componentWillUnmount() {
        this.$node.nestedSortable('destroy');
    }
}

export default NestedSortable;