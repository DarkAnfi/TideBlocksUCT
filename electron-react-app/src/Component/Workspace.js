import React, { Component } from 'react';

class Workspace extends Component {

    componentDidMount() {
        this.$node = window.$(this.refs.nestedSortable);
        this.$node.nestedSortable({
            listType: 'ul',
            handle: 'div',
            items: 'li',
            toleranceElement: '> div',
            cancel: "div[data-block='value'],input,textarea,button,select,option",
            isAllowed: this.props.app.isAllowed,
            stop: this.props.app.stop,
            start: this.props.app.start,
            update: this.props.app.update
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
            <ul ref="nestedSortable" className="sortable" id="workspace" style={{ paddingBottom: "calc(100vh - 57px - 27px - 30px)", margin: '0px' }} />
        );
    }
}

export default Workspace;