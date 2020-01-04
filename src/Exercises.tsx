import React from "react";
import { Exercise } from "./types";
import { createExercise, watchExercises } from "./Database";

export default class Exercises extends React.PureComponent {
  state = { exercises: [] };

  constructor(props) {
    super(props);
    watchExercises(this.updateExercises);
  }

  updateExercises = (newExercises: Array<Exercise>) => {
    this.setState({ exercises: newExercises });
  };

  newExercise = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    createExercise(form.get("name"), form.get("description"));
    event.target.reset();
  };

  render() {
    const { exercises } = this.state;

    return (
      <div>
        <h3>Exercises</h3>
        <form className="section" onSubmit={this.newExercise}>
          <label>
            Create a new exercise!
            <input
              type="text"
              name="name"
              defaultValue={""}
              placeholder="exercise name"
            />
            <input
              type="text"
              name="description"
              defaultValue={""}
              placeholder="exercise description"
            />
          </label>

          <button type="submit">create</button>
        </form>
        <h3>Your exercises</h3>
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
      </div>
    );
  }
}
