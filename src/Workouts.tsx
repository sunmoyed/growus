import React from "react";
import { Exercise } from "./types";

export default class Workouts extends React.PureComponent {
  state = { exercises: [] };

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
      </div>
    );
  }
}
