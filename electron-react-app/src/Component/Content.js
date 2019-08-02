import React from 'react';
import { Container } from 'reactstrap';
import Scrollbar from './Scrollbar';
import ProjectNavegator from './ProjectNavegator';
import Workspace from './Workspace';
import classNames from 'classnames';
import './Content.css';

class Content extends React.Component {

  render() {
    return (
      <Container fluid className={classNames('Content', { 'is-open': this.props.isOpen })}>
        <ProjectNavegator app={this.props.app} />
        <Scrollbar>
          <Workspace app={this.props.app} />
        </Scrollbar>
      </Container>
    );
  }
}

export default Content;