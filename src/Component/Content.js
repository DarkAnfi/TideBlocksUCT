import React from 'react';
import { Container } from 'reactstrap';
import Workspace from './Workspace';
import Scrollbar from './Scrollbar';
import classNames from 'classnames';
import './Content.css';

class Content extends React.Component {

  render() {
    return (
      <Container fluid className={classNames('Content', { 'isLeft': this.props.isLeft }, { 'isRight': this.props.isRight })}>
        <Scrollbar>
          <div id="loop-header">Ciclo principal</div>
          <div>
            <Workspace app={this.props.app} />
          </div>
        </Scrollbar>
      </Container>
    );
  }
}

export default Content;