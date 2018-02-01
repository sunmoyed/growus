import React, { Component } from 'react';

import Exercise from './Exercise.js'

class Workout extends Component {

  render() {
    const { exercises } = this.props

    return (
      <div className="workout">
        <ul>
          {exercises.map((exercise, index) => (<Exercise key={index}>{exercise}</Exercise>))}
        </ul>
      </div>
    );
  }
}

export default Workout;
