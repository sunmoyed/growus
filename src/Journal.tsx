import React from "react";
import Calendar from "react-calendar";

import { Workout, Entry, FirestoreUser } from "./types";
import {
  createJournalEntry,
  watchWorkouts,
  watchEntries,
  getRecentEntries,
} from "./Database";

import { ColorSquare } from "./ColorPicker";
import UserBadge from "./User";
import { NEW_WORKOUT } from "./Workouts";

export default class Journal extends React.PureComponent<{
  user: FirestoreUser;
}> {
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
    this.getColorsForDates(entries, hotDates);
    this.setState({ entries, hotDates });
  };

  getEntries = async (lastTimestamp = new Date()) => {
    const nextEntries = await getRecentEntries(
      lastTimestamp,
      this.props.user ? this.props.user.uid : undefined
    );

    if (nextEntries) {
      const { hotDates } = this.state;
      this.getColorsForDates(nextEntries, hotDates);

      this.setState(({ entries }: { entries: Array<Entry> }) => {
        return { entries: entries.concat(nextEntries), hotDates };
      });
    }
  };

  getColorsForDates = (entries, hotDates) => {
    entries.forEach((entry: Entry) => {
      if (entry.entryTime) {
        const date = entry.entryTime.toDate().toDateString();
        if (date in hotDates) {
          hotDates[date].push(entry.workout.color);
        } else {
          let colorArray = [entry.workout.color];
          hotDates[date] = colorArray;
        }
      }
    });
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
            const workoutColors = hotDates[date.toDateString()];
            if (view === "month" && workoutColors) {
              return workoutColors.map((color) => (
                <ColorSquare color={color} size={8} />
              ));
            }
            return null;
          }}
        />
        {entries.map((entry: Entry, index) => (
          <JournalEntryDisplay key={entry.id ? entry.id : index} {...entry} />
        ))}

        <button onClick={() => this.getEntries(getLastTimestamp(entries))}>
          more
        </button>
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

  getEntries = async (lastTimestamp = new Date()) => {
    const nextEntries = await getRecentEntries(lastTimestamp);

    if (nextEntries) {
      this.setState(({ entries }: { entries: Array<Entry> }) => {
        return { entries: entries.concat(nextEntries) };
      });
    }
  };

  render() {
    const { entries } = this.state;

    return (
      <div>
        <h3>All our journals</h3>
        {entries.map((entry: Entry, index) => (
          <JournalEntryDisplay key={entry.id ? entry.id : index} {...entry} />
        ))}
        <button onClick={() => this.getEntries(getLastTimestamp(entries))}>
          more
        </button>
      </div>
    );
  }
}

function getLastTimestamp(arr) {
  const lastItem: any = arr.slice(-1).pop();
  const lastTime = lastItem ? lastItem.entryTime : null;

  return lastTime;
}

class JournalEntry extends React.PureComponent<
  { workouts: Array<Workout> },
  { error: string; workout: Workout; date: Date; showCalendar: boolean }
> {
  state = {
    error: "",
    workout: NEW_WORKOUT,
    date: new Date(),
    showCalendar: false,
  };

  selectWorkout = (event) => {
    const index = event.target.value;
    if (index) {
      const { workouts } = this.props;
      this.setState({ workout: workouts[index] });
    }
  };

  handleCreateEntry = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = form.get("title");
    const content = form.get("content");
    const { workout, date } = this.state;

    if (!workout) {
      this.setState({ error: "which workout did you do today?" });
      return;
    } else if (!title) {
      this.setState({ error: "The workout needs a title" });
      return;
    }

    createJournalEntry(title, content, workout, date);
    this.setState({ error: "", workout: NEW_WORKOUT });
    event.target.reset();
  };

  handleCalendarChange = (date: Date | Date[]) => {
    if (date as Date) {
      this.setState({ date: date as Date, showCalendar: false });
    }
  };

  handleDateClick = (event: React.MouseEvent) => {
    event.preventDefault();
    this.setState((prevState) => ({ showCalendar: !prevState.showCalendar }));
  };

  render() {
    const { workouts } = this.props;
    const { error, showCalendar, date } = this.state;

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
          <button onClick={this.handleDateClick}>
            {date.toLocaleDateString()}
          </button>
          {showCalendar && (
            <Calendar onChange={this.handleCalendarChange} value={date} />
          )}
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
  creator,
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
