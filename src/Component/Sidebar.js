import React from 'react';
import classNames from 'classnames';
import './Sidebar.css';

class Sidebar extends React.Component {

  render() {
    return (
      <div className={classNames('Sidebar', { 'is-open': this.props.isOpen }, this.props.side ? this.props.side : 'left')}>
        {this.props.children}
      </div>
    );
  }
}

export default Sidebar;