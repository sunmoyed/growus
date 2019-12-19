import React from "react";
import { Exercise, Workout } from "./types";
import { watchExercises } from "./Database";

export default class Workouts extends React.PureComponent {
  state = { exercises: [] };

  constructor(props) {
    super(props);
    watchExercises(this.updateExercises);
  }

  updateExercises = (newExercises: Array<Exercise>) => {
    this.setState({ exercises: newExercises });
  };

  addExercise = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    // updateWorkout(form.get("name"), form.get("description"));
    // event.target.reset();
  };

  render() {
    const { exercises } = this.state;

    return (
      <div>
        <ul>
          {exercises.map((exercise: Exercise, index) => {
            return (
              <li key={index}>
                <div>
                  <b>{exercise.name}</b>
                </div>
                <div>{exercise.description}</div>
              </li>
            );
          })}
        </ul>
        <form className="section" onSubmit={this.addExercise}>
          <label>
            Plan a new workout
            <input
              type="text"
              name="name"
              defaultValue=""
              placeholder="leg day"
            />
            <input
              type="text"
              name="description"
              defaultValue={""}
              placeholder="workout description"
            />
          </label>

          <label>
            Add exercise
            <select name="exercise" id="pet-select">
              {exercises.map((exercise: Exercise, index) => {
                return (
                  <option key={index} value="">
                    {exercise.name}
                    {exercise.description && " - "}
                    {exercise.description}
                  </option>
                );
              })}
            </select>
          </label>
          <button type="submit">add</button>
        </form>
      </div>
    );
  }
}
