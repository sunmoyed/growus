import React, { Component } from 'react';

import Workout from './Workout'

class RandomWorkout extends Component {

  state = {
    exercises: []
  }

  componentWillMount() {
    this.fetchRandomWorkout()
  }

  fetchRandomWorkout() {
    fetch('http://localhost:9001/workout/random')
      .then(results => results.json())
      .then(jsonResponse => {
        this.setState({exercises: jsonResponse.workout})
        return jsonResponse.workout
      })
  }

  render() {
    return (
      <div className="container">
        Here is your random workout of the day:
        <Workout exercises={this.state.exercises} />
      </div>
    )
  }
}

export default RandomWorkout;
