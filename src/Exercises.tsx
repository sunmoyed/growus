import React from "react";
import { Exercise } from "./types";

const exerciseBank: Array<Exercise> = [
  { name: "mountain climbers", tags: ["core"] },
  { name: "bicycles", tags: ["core"] }
];

export default class Exercises extends React.PureComponent {
  state = { exercises: exerciseBank };

  render() {
    const { exercises } = this.state;

    return (
      <div>
        <ul>
          {exercises.map((exercise: Exercise) => {
            return <li>{exercise.name}</li>;
          })}
        </ul>
        <form className="section" onSubmit={() => {}}>
          <label>
            Enter a new exercise!
            <input type="text" name="exercise" defaultValue={""} />
          </label>

          <button type="submit">create</button>
        </form>
      </div>
    );
  }
}
