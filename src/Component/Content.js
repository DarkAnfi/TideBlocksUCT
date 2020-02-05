/** Content
 * Componente designado para contener la parte central de la ventana.
 * Posee la capacidad a nivel css y jsx de ajustarse según estén abiertos
 * o cerrados los sidebars.
 * Posee un control especifico de scrollbar para el workspace.
 * Ultima modificación: 05/02/2020 v1.10.4
 */
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
          <div>
            <Workspace app={this.props.app} />
          </div>
        </Scrollbar>
      </Container>
    );
  }
}

export default Content;