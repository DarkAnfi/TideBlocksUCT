import React, { Component } from 'react';
import Header from './Component/Header';
import Sidebar from './Component/Sidebar';
import Content from './Component/Content';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.toggleLeft = this.toggleLeft.bind(this);
    this.toggleRight = this.toggleRight.bind(this);
    this.state = {
      left: true,
      right: false
    }
  }

  toggleLeft() {
    this.setState({ left: !this.state.left });
  }

  toggleRight() {
    this.setState({ right: !this.state.right });
  }

  render() {
    return (
      <div className="App" >
        <Header />
        <main>
          <Sidebar isOpen={this.state.left} side="left">
            <h1>Hello Left Sidebar</h1>
          </Sidebar>
          <button color="secondary" onClick={this.toggleLeft} id="btn-toggle-sidebar">
            {this.state.left ? '<' : '>'}
          </button>
          <Content />
          <button color="secondary" onClick={this.toggleRight} id="btn-toggle-sidebar">
            {this.state.right ? '>' : '<'}
          </button>
          <Sidebar isOpen={this.state.right} side="right">
            <h1>Hello Right Sidebar</h1>
          </Sidebar>
        </main>
      </div>
    );
  }
}
export default App;
