import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <p>let's grow us <img src={logo} className="App-logo" alt="logo" /></p>
        </div>
      </div>
    );
  }
}

export default App;
