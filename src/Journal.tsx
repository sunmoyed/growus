import React from "react";
import { Workout } from "./types";
import { createJournalEntry, watchWorkouts } from "./Database";
import { NEW_WORKOUT } from "./Workouts";

export default class Journal extends React.PureComponent {
  state = { workouts: [] };

  constructor(props) {
    super(props);
    watchWorkouts(this.handleWorkoutsChange);
  }

  handleWorkoutsChange = (workouts: Array<Workout>) => {
    this.setState({ workouts });
  };

  render() {
    const { workouts } = this.state;

    return (
      <div>
        <h3>Your Journal</h3>
        <JournalEntry workouts={workouts} />
      </div>
    );
  }
}

const WorkoutDisplay = ({ workout }) => {
  return (
    <div className="section section-border">
      <h4>{workout.title}</h4>
      {workout.description && <p>{workout.description}</p>}
      {/* the exercises:
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
      </ul> */}
    </div>
  );
};

class JournalEntry extends React.PureComponent<
  { workouts: Array<Workout> },
  { error: string; workout: Workout }
> {
  state = { error: "", workout: NEW_WORKOUT };

  selectWorkout = event => {
    const index = event.target.value;
    if (index) {
      const { workouts } = this.props;
      this.setState({ workout: workouts[index] });
    }
  };

  handleCreateEntry = async event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = form.get("title");
    const content = form.get("content");
    const { workout } = this.state;

    if (!workout) {
      this.setState({ error: "which workout did you do today?" });
      return;
    } else if (!title) {
      this.setState({ error: "The workout needs a title" });
      return;
    }

    createJournalEntry(title, content, workout);
    this.setState({ error: "", workout: NEW_WORKOUT });
    event.target.reset();
  };

  render() {
    const { workouts } = this.props;
    const { error, workout } = this.state;

    return (
      <div>
        {error && <p className="error">{error}</p>}
        <form className="section" onSubmit={this.handleCreateEntry}>
          <label>
            How did you grow today?
            <select
              name="exercise"
              id="exercise-select"
              onChange={this.selectWorkout}
            >
              <option value=""></option>
              {workouts.map((workout: Workout, index) => {
                return (
                  <option key={workout.id} value={index}>
                    {workout.title}
                    {workout.description && " - "}
                    {workout.description}
                  </option>
                );
              })}
            </select>
          </label>
          <WorkoutDisplay key={workout.title} workout={workout} />
          <label>
            <input
              type="text"
              name="title"
              defaultValue={""}
              placeholder="journal entry title"
            />
            <textarea
              name="content"
              defaultValue={""}
              placeholder="how did you feel?"
            />
          </label>
          <button type="submit">write in your journal</button>
        </form>
      </div>
    );
  }
}
