import React from 'react';
import './Scrollbar.css';

class Scrollbar extends React.Component {

    render() {
        return (
            <div className="scrollbar" color={this.props.color?this.props.color:"secondary"}>
                { this.props.children }
            </div>
        );
    }
}

export default Scrollbar;