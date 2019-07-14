import React from 'react';
import { Container } from 'reactstrap';
import Workspace from './Workspace';
import Scrollbar from './Scrollbar';
import './Content.css';

class Content extends React.Component {

  render() {
    return (
      <Container fluid className="Content">
        <Scrollbar>
          <Workspace></Workspace>
        </Scrollbar>
      </Container>
    );
  }
}

export default Content;