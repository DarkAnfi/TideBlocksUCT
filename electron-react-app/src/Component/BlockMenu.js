import React from 'react';
import { Badge, Collapse } from 'reactstrap';
import classNames from 'classnames';
import './BlockMenu.css';

class BlockMenu extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    render() {
        return (
            <div className={classNames('BlockMenu',this.props.className)}>
                <div className="btn-collapse-block-menu" onClick={this.toggle}>
                    <Badge color={this.props.color} pill>&nbsp;</Badge>
                    &nbsp;{this.props.title}
                </div>
                <Collapse isOpen={this.state.collapse}>
                    {this.props.children}
                </Collapse>
            </div>
        );
    }
}

export default BlockMenu;