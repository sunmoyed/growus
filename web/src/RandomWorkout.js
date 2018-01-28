import React from 'react';

import Exercise from './Exercise.js'
import Workout from './Workout.js'

class RandomWorkout extends Workout {
  constructor(props) {
    super(props);
    this.state = {
      workout: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:9001/workout/random')
      .then(results => results.json())
      .then(jsonResponse => {
        console.log(jsonResponse);
        this.setState({workout: jsonResponse.workout})
        return jsonResponse.workout
      })
  }

  render() {
    const {workout} = this.state;

    return (
      <div className="workout container">
        <ul>
          {workout.map((exercise, index) => (<Exercise key={index}>{exercise}</Exercise>))}
        </ul>
      </div>
    );
  }
}

export default RandomWorkout;
