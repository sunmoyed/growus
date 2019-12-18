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
        <form className="section" onSubmit={this.newExercise}>
          <label>
            Enter a new exercise!
            <input type="text" name="name" defaultValue={""} />
            <input
              type="text"
              name="description"
              defaultValue={""}
              placeholder="exercise description"
            />
          </label>

          <button type="submit">create</button>
        </form>
      </div>
    );
  }
}