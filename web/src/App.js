import React, { Component } from 'react';

import Editor from './Editor'
import RandomWorkout from './RandomWorkout'
import Workouts from './Workouts'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="container">
          <h2>let's grow us <img src={logo} className="App-logo" alt="logo" /></h2>
        </header>
        <RandomWorkout />
        <Workouts />
        <Editor />
      </div>
    );
  }
}

export default App;
