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
        <ExerciseList
          exercises={exercises}
        />
      </div>
    );
  }
}

export const ExerciseList = ({
  exercises,
  onDelete,
  onEdit
}: {
  exercises: Array<Exercise>;
  onDelete?: (id) => void;
  onEdit?: (exercise: Exercise) => void;
}) => (
  <ul className="description-list">
    {exercises.map((exercise: Exercise, index) => {
      return (
        <li key={index}>
          <ExerciseDisplay {...exercise} />
          {(onEdit || onDelete) && (
            <div>
              {onEdit && (
                <button
                  className="text-button icon-button"
                  onClick={() => onEdit(exercise)}
                >
                  ✎
                </button>
              )}
              {onDelete && (
                <button
                  className="text-button icon-button"
                  onClick={() => onDelete(exercise.id)}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

export const ExerciseDisplay = ({ name, description }: Exercise) => (
  <div>
    <b style={{ display: "block" }}>{name}</b>
    <div className="description">{description}</div>
  </div>
);
