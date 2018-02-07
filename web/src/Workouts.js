import React, { Component } from 'react';

import Workout from './Workout'

class Workouts extends Component {

  constructor(props) {
    super()

    this.state = {
      workouts: []
    }
  }

  componentWillMount() {
    this.fetchWorkouts()
  }

  fetchWorkouts() {
    fetch('http://localhost:9001/workouts')
      .then(results => results.json())
      .then(jsonResponse => {
        this.setState({workouts: jsonResponse})
      })
  }

 createWorkout(workout, key) {
   return (
     <Workout
       title={workout.title}
       exercises={workout.exercises}
       key={key}/>
   )
 }

 toggleCheckbox(label) {

 }

 // TODO
  render() {
    const { workouts } = this.state

    return (
      <div className="container">
        <h2>your workouts</h2>
        {workouts.map((workout, index) => this.createWorkout(workout, index))}
      </div>
    );
  }
}

export default Workouts;
