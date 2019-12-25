import React from "react";
import { Exercise, Workout } from "./types";
import {
  watchExercises,
  watchWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout
} from "./Database";

const NEW_WORKOUT = {
  title: "",
  description: "",
  exercises: [],
  userid: ""
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
        <h3>create a new workout</h3>
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
  { error: string; exercises: Array<string> }
> {
  state = {
    error: "",
    exercises: this.props.workout ? this.props.workout.exercises : []
  };

  addExercise = async event => {
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
    const { exercises } = this.state;

    if (!title) {
      this.setState({ error: "The workout needs a title" });
      return;
    }
    if (workout.id) {
      await updateWorkout(workout.id, { title, description, exercises });
      this.setState({ error: "" });
    } else {
      createWorkout(title, description, exercises);
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

  render() {
    const { exerciseBank, workout } = this.props;
    const { error, exercises } = this.state;
    const [availableExercises, workoutExercises] = sortExercises(
      exercises,
      exerciseBank
    );

    return (
      <div className="section section-border">
        {error && <p className="error">{error}</p>}
        <form className="section" onSubmit={this.handleCreateWorkout}>
          <label>
            <input
              type="text"
              name="title"
              defaultValue={workout && workout.title}
              placeholder="new workout"
            />
            <input
              type="text"
              name="description"
              defaultValue={workout && workout.description}
              placeholder="workout description"
            />
          </label>
          the exercises:
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
