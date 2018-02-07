import React, { Component } from 'react';

import Exercise from './Exercise.js'

class Workout extends Component {

  render() {
    const { exercises, title } = this.props

    return (
      <div className="workout">
      <h3>{title}</h3>
        <ul>
          {exercises.map((exercise, index) => (<Exercise key={index}>{exercise}</Exercise>))}
        </ul>
      </div>
    );
  }
}

export default Workout;
