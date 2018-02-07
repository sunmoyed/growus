import React, { Component } from 'react';

import Actions from './Actions'
import Editor from './Editor'
import RandomWorkout from './RandomWorkout'
import Workouts from './Workouts'
import logo from './logo.svg';
import './App.css';

const views = {
  "workouts/random": RandomWorkout,
  "workouts": Workouts,
  "workouts/create": Editor
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      path: window.location.pathname
    }
  }

  // removes the start slash if it exists
  parsePath(path) {
    return path.toLowerCase().slice(path[0] === '/'? 1 : 0);
  }

  handleNavigation = (path) => {
    this.setState({path})
  }

  render() {
    const parsedPath = this.parsePath(this.state.path)
    const TagName = views[parsedPath] || 'span';

    return (
      <div className="App">
        <header className="container">
          <h2>let's grow us <img src={logo} className="App-logo" alt="logo" /></h2>
        </header>
        <Actions links={[
          {
            path: 'workouts/random',
            title: 'workout of the day',
            handler: this.handleNavigation.bind(this, 'workouts/random')
          },
          {
            path: 'workouts',
            title: 'workout bank',
            handler: this.handleNavigation.bind(this, 'workouts')
          },
          {
            path: 'workouts/create',
            title: 'create a new workout',
            handler: this.handleNavigation.bind(this, 'workouts/create')
          }
        ]}/>
        <TagName />
      </div>
    );
  }
}

export default App;
