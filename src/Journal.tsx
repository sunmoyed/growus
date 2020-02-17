import React from "react";
import Calendar from "react-calendar";

import { Workout, Entry } from "./types";
import {
  createJournalEntry,
  watchWorkouts,
  watchEntries,
  getRecentEntries
} from "./Database";

import { ColorSquare } from "./ColorPicker";
import UserBadge from "./User";
import { NEW_WORKOUT } from "./Workouts";

export default class Journal extends React.PureComponent {
  state = { workouts: [], entries: [], hotDates: {} };

  constructor(props) {
    super(props);
    watchWorkouts(this.handleWorkoutsChange);
    watchEntries(this.handleEntriesChange);
  }

  handleWorkoutsChange = (workouts: Array<Workout>) => {
    this.setState({ workouts });
  };

  handleEntriesChange = (entries: Array<Entry>) => {
    const hotDates = {};
    entries.forEach((entry: Entry) => {
      if (entry.entryTime) {
        hotDates[entry.entryTime.toDate().toDateString()] = entry.workout.color;
      }
    });
    this.setState({ entries, hotDates });
  };

  render() {
    const { entries, workouts, hotDates } = this.state;

    return (
      <div>
        <h3>Your Journal</h3>
        <JournalEntry workouts={workouts} />
        <Calendar
          className="section"
          tileContent={({ date, view }) => {
            const workoutColor = hotDates[date.toDateString()];
            if (view === "month" && workoutColor) {
              return <ColorSquare color={workoutColor} size={8} />;
            }
            return null;
          }}
        />
        {entries.map((entry: Entry, index) => (
          <JournalEntryDisplay key={entry.id ? entry.id : index} {...entry} />
        ))}
      </div>
    );
  }
}
export class GroupJournal extends React.PureComponent {
  state = { entries: [] };

  constructor(props) {
    super(props);
    this.getEntries();
  }
  getEntries = async () => {
    const entries = await getRecentEntries();

    this.setState({ entries });
  };

  render() {
    const { entries } = this.state;

    return (
      <div>
        <h3>All our journals</h3>
        {entries.map((entry: Entry, index) => (
          <JournalEntryDisplay key={entry.id ? entry.id : index} {...entry} />
        ))}
      </div>
    );
  }
}

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
    const { error } = this.state;

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
          <label>
            <input
              type="text"
              name="title"
              defaultValue={""}
              placeholder="journal entry title"
            />
          </label>
          <label>
            <textarea
              name="content"
              defaultValue={""}
              placeholder="what was it like? how did you feel?"
            />
          </label>
          <button type="submit">write in your journal</button>
        </form>
      </div>
    );
  }
}

const JournalEntryDisplay = ({
  content,
  title,
  workout,
  entryTime,
  creator
}: Entry) => {
  return (
    <section className="card">
      <UserBadge
        {...creator}
        size={34}
        subtitle={entryTime.toDate().toLocaleString()}
        noun={workout.title}
      />
      <div className="card-content">
        <h4>{title}</h4>
        {content && <p>{content}</p>}
      </div>
    </section>
  );
};
