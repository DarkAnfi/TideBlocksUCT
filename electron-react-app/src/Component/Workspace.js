import React, { Component } from 'react';

class Workspace extends Component {
    isAllowed(placeholder, placeholderParent, currentItem) {
        if (placeholderParent) {
            if (placeholderParent.hasClass('locked')) {
                return false;
            } else {
                if (currentItem.attr('data-block') == "else") {
                    if (placeholder.prev().attr('data-block') != "if") {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (placeholder.next().attr('data-block') == "else") {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        } else {
            if (currentItem.attr('data-block') == "else") {
                if (placeholder.prev().attr('data-block') != "if") {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (placeholder.next().attr('data-block') == "else") {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

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
            <ul ref="nestedSortable" className="sortable" style={{minHeight: "calc(100vh - 86px)"}}>
                {this.props.children}
            </ul>
        );
    }

    componentWillUnmount() {
        this.$node.nestedSortable('destroy');
    }
}

export default Workspace;