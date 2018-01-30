import React from 'react';

import Workout from './Workout'

class RandomWorkout extends Workout {

  componentWillMount() {
    this.fetchRandomWorkout()
  }

  fetchRandomWorkout() {
    fetch('/workout/random')
      .then(results => results.json())
      .then(jsonResponse => {
        this.setState({workout: jsonResponse.workout})
        return jsonResponse.workout
      })
  }
}

export default RandomWorkout;
