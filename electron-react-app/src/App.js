import React, { Component } from 'react';
import Header from './Component/Header';
import Sidebar from './Component/Sidebar';
import Content from './Component/Content';
import LeftContent from './Component/LeftContent';
import { Button } from 'reactstrap';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      sidebar: true
    }
  }

  toggle() {
    this.setState({ sidebar: !this.state.sidebar });
  }

  render() {
    return (
      <div className="App" >
        <Header />
        <main>
          <Sidebar isOpen={this.state.sidebar}>
            <LeftContent />
          </Sidebar>
          <Button onClick={this.toggle} id="btn-toggle-sidebar">
            {this.state.sidebar ? '<' : '>'}
          </Button>
          <Content />
        </main>
      </div>
    );
  }
}
export default App;
