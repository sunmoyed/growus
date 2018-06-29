import React, { Component } from 'react';

import Exercise from './Exercise.js'

class Workout extends Component {

  constructor(props) {
    super()

    this.state = {
      workout: []
    }
  }

  render() {
    const { workout } = this.state

    return (
      <div className="workout">
        <ul>
          {workout.map((exercise, index) => (<Exercise key={index}>{exercise}</Exercise>))}
        </ul>
      </div>
    );
  }
}

export default Workout;
