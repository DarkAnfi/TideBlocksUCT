import React from 'react';
import { Container } from 'reactstrap';
import Workspace from './Workspace';
import Scrollbar from './Scrollbar';
import classNames from 'classnames';
import './Content.css';

class Content extends React.Component {

  render() {
    return (
      <Container fluid className={classNames('Content', { 'is-open': this.props.isOpen })}>
        <Scrollbar>
          <Workspace app={this.props.app}></Workspace>
        </Scrollbar>
      </Container>
    );
  }
}

export default Content;