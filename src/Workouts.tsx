import React from "react";
import { Exercise, Workout } from "./types";
import {
  watchExercises,
  watchWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout
} from "./Database";
import ColorPicker, { ColorSquare } from "./ColorPicker";

const WORKOUT_COLORS = [
  "ffdbb9",
  "fff1aa",
  "cdfba6",
  "97efc4",
  "77f5e6",
  "77d5ff",
  "95b5ff"
];

const NEW_WORKOUT = {
  title: "",
  description: "",
  exercises: [],
  userid: "",
  color: WORKOUT_COLORS[0]
};

function sortExercises(ids: Array<string>, bank: Array<Exercise>) {
  const availableExercises: Array<Exercise> = [];
  const workoutExercises: Array<Exercise> = [];
  bank.forEach(exercise => {
    if (exercise.id && ids.includes(exercise.id)) {
      workoutExercises.push(exercise);
    } else {
      availableExercises.push(exercise);
    }
  });

  return [availableExercises, workoutExercises];
}

export default class Workouts extends React.PureComponent {
  state = { exerciseBank: [], workouts: [] };

  constructor(props) {
    super(props);
    watchExercises(this.handleExercisesChange);
    watchWorkouts(this.handleWorkoutsChange);
  }

  handleExercisesChange = (newExercises: Array<Exercise>) => {
    this.setState({ exerciseBank: newExercises });
  };

  handleWorkoutsChange = (workouts: Array<Workout>) => {
    this.setState({ workouts });
  };

  render() {
    const { exerciseBank, workouts } = this.state;

    return (
      <div>
        <h3>New workout</h3>
        <EditWorkout workout={NEW_WORKOUT} exerciseBank={exerciseBank} />
        <h3>Your workouts :)</h3>
        {workouts.map((workout: Workout) => (
          <EditWorkout
            key={workout.title}
            workout={workout}
            exerciseBank={exerciseBank}
          />
        ))}
      </div>
    );
  }
}

class EditWorkout extends React.PureComponent<
  { workout: Workout; exerciseBank: Array<Exercise> },
  { color: string; error: string; exercises: Array<string> }
> {
  state = {
    color: this.props.workout.color || WORKOUT_COLORS[0],
    error: "",
    exercises: this.props.workout ? this.props.workout.exercises : []
  };

  addExercise = event => {
    const exerciseID = event.target.value;
    if (exerciseID) {
      this.setState(state => {
        const exercises = state.exercises.slice();
        const duplicate = exercises.includes(exerciseID);
        if (!duplicate) {
          exercises.push(exerciseID);
        }

        return { exercises };
      });

      event.target.selectedIndex = null;
    }
  };

  removeExercise = id => {
    const { exercises } = this.state;
    var index = exercises.indexOf(id);
    if (index > -1) {
      const newExercises = exercises.slice();
      newExercises.splice(index, 1);

      this.setState({ exercises: newExercises });
    }
  };

  handleCreateWorkout = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = form.get("title");
    const description = form.get("description");
    const { workout } = this.props;
    const { color, exercises } = this.state;

    if (!title) {
      this.setState({ error: "The workout needs a title" });
      return;
    }
    if (workout.id) {
      await updateWorkout(workout.id, { color, title, description, exercises });
      this.setState({ error: "" });
    } else {
      createWorkout(title, description, exercises, color);
      this.setState({ error: "" });
      event.target.reset();
    }
  };

  handleDeleteWorkout = async e => {
    const { workout } = this.props;

    if (window.confirm("Are you sure you wish to delete this workout?")) {
      deleteWorkout(workout.id);
    }
  };

  handleColorPick = color => this.setState({ color });

  render() {
    const { exerciseBank, workout } = this.props;
    const { color, error, exercises } = this.state;
    const [availableExercises, workoutExercises] = sortExercises(
      exercises,
      exerciseBank
    );

    return (
      <div className="section workout">
        {error && <p className="error">{error}</p>}
        <form onSubmit={this.handleCreateWorkout}>
          <label>
            <input
              type="text"
              name="title"
              defaultValue={workout && workout.title}
              placeholder="workout name"
            />
          </label>
          <label>
            <input
              type="text"
              name="description"
              defaultValue={workout && workout.description}
              placeholder="workout description"
            />
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Color marker: </span>
            <ColorPicker
              colors={WORKOUT_COLORS}
              color={color}
              onColorClick={this.handleColorPick}
            />
          </div>
          <h4>exercises:</h4>
          <ul>
            {workoutExercises.map((exercise, index) => {
              return (
                <li key={index}>
                  <div>
                    <b>{exercise.name}</b>
                  </div>
                  <div>{exercise.description}</div>
                  <button
                    className="text-button"
                    onClick={() => this.removeExercise(exercise.id)}
                  >
                    x
                  </button>
                </li>
              );
            })}
          </ul>
          <label>
            Add exercises:
            <select
              name="exercise"
              id="exercise-select"
              onChange={this.addExercise}
            >
              <option value=""></option>
              {availableExercises.map((exercise: Exercise, index) => {
                return (
                  <option key={index} value={exercise.id}>
                    {exercise.name}
                    {exercise.description && " - "}
                    {exercise.description}
                  </option>
                );
              })}
            </select>
          </label>
          <div>
            <button type="submit">
              {workout.id ? "update" : "create"} workout
            </button>
            {workout.id && (
              <button onClick={this.handleDeleteWorkout}>delete workout</button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export const WorkoutLabel = ({ workout }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <ColorSquare color={workout.color} size={16} />
    <span style={{ marginLeft: "6px" }}> {workout.title}</span>
  </div>
);
