import React from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { firestore } from "firebase";

import { Workout, Entry as EntryType, FirestoreUser, User } from "./types";
import {
  createJournalEntry,
  watchWorkouts,
  watchEntries,
  getUserById,
  getWorkoutById,
  filterEntrySnapshot,
  filterEntrySnapshotByUser,
  deleteJournalEntry,
} from "./Database";
import { Entry } from "./Classes";
import { goTo } from "./History";

import UserBadge from "./User";
import Modal from "./Modal";
import boney from "./images/boney_dig.gif";

const DISPLAY_INTERVAL_DAYS = 7;

const CalendarTile = ({ date, view, hotDates, workouts }) => {
  const workoutsForDay = hotDates[date.toDateString()] || [];
  if (view === "month") {
    return (
      <div className="calendar-activity-icon">
        {workoutsForDay.map((workoutRef) => {
          if (workoutRef) {
            const workout = findWorkoutById(workoutRef.id, workouts);
            if (workout) {
              return workout.emoji;
            }
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

function getTileClassName(date, view, hotDates, workouts): string | null {
  if (view === "month") {
    const workoutsForDay = hotDates[date.toDateString()] || [];
    const isActive = workoutsForDay.some((workoutRef) => {
      if (workoutRef) {
        const workout = findWorkoutById(workoutRef.id, workouts);
        if (workout?.isPhysicalActivity) {
          return true;
        }
      }
      return false;
    });
    if (isActive) {
      return "calendar-active-day";
    }
  }
  return null;
}

function getHotDates(entriesSnapshot: firestore.QuerySnapshot) {
  const hotDates = {};
  entriesSnapshot.forEach((doc) => {
    const entry = doc.data();
    if (entry.entryTime) {
      const date = entry.entryTime.toDateString();
      if (date in hotDates) {
        hotDates[date].push(entry.workoutRef);
      } else {
        let workouts = [entry.workoutRef];
        hotDates[date] = workouts;
      }
    }
  });
  return hotDates;
}

function findWorkoutById(id, workouts: Array<Workout>) {
  return workouts.find((workout) => workout.id === id);
}

type JournalState = {
  cancelEntriesWatcher: () => void;
  cancelWorkoutsWatcher: () => void;
  workouts: Workout[];
  entries: any[];
  hotDates: any;
  isLoading: boolean;
  entriesSnapshot?: firestore.QuerySnapshot;
  endTime: moment.Moment;
  startTime: moment.Moment;
};
export default class Journal extends React.Component<
  {
    user: FirestoreUser;
    userData: User;
    showAddEntry: boolean;
  },
  JournalState
> {
  constructor(props) {
    super(props);

    let cancelWorkoutsWatcher;
    watchWorkouts(this.handleWorkoutsChange, props.user.uid).then((fn) => {
      cancelWorkoutsWatcher = fn;
      this.setState({ cancelWorkoutsWatcher });
    });

    let cancelEntriesWatcher;
    watchEntries(this.handleEntriesChange).then((fn) => {
      cancelEntriesWatcher = fn;
      this.setState({ cancelEntriesWatcher });
    });

    this.state = {
      cancelEntriesWatcher,
      cancelWorkoutsWatcher,
      workouts: [],
      entries: [],
      hotDates: {},
      isLoading: true,
      entriesSnapshot: undefined,
      endTime: moment().subtract(DISPLAY_INTERVAL_DAYS, "days"),
      startTime: moment(), // today
    };
  }

  componentWillUnmount() {
    this.state.cancelEntriesWatcher();
    this.state.cancelWorkoutsWatcher();
  }

  handleWorkoutsChange = (workouts: Array<Workout>) => {
    this.setState({ workouts });
  };

  handleEntriesChange = async (entriesSnapshot: firestore.QuerySnapshot) => {
    const { endTime, startTime } = this.state;
    const { user } = this.props;
    this.setState({ isLoading: true });

    const snapshot = await filterEntrySnapshotByUser(
      entriesSnapshot,
      startTime,
      endTime,
      user.uid
    );
    this.setState({ entriesSnapshot: snapshot });

    const entries: firestore.DocumentData[] = [];
    snapshot.forEach((doc) => entries.push(doc.data()));
    this.setState({
      entries,
      isLoading: false,
      endTime: moment(endTime).subtract(DISPLAY_INTERVAL_DAYS, "day"),
    });

    const firstOfMonth = moment(startTime).startOf("month");
    const lastOfMonth = moment(startTime).endOf("month");
    const monthSnapshot = await filterEntrySnapshotByUser(
      entriesSnapshot,
      lastOfMonth,
      firstOfMonth,
      user.uid
    );

    const hotDates = getHotDates(monthSnapshot);
    this.setState({ hotDates });
  };

  handleNewDateClick = async (date, event) => {
    const { entriesSnapshot } = this.state;
    const { user } = this.props;
    const startTime = moment(date);
    const endTime = moment(startTime).subtract(DISPLAY_INTERVAL_DAYS, "days");

    if (entriesSnapshot) {
      this.setState({ isLoading: true });
      const snapshot = await filterEntrySnapshotByUser(
        entriesSnapshot,
        startTime,
        endTime,
        user.uid
      );

      const entries: firestore.DocumentData[] = [];
      snapshot.forEach((doc) => entries.push(doc.data()));
      this.setState({ entries, isLoading: false, startTime, endTime });
    }
  };

  handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view !== "month") {
      return;
    }

    this.fetchHotDates(
      moment(activeStartDate).endOf("month"),
      moment(activeStartDate)
    );
  };

  fetchHotDates = async (start: moment.Moment, end: moment.Moment) => {
    const { user } = this.props;
    const { entriesSnapshot } = this.state;

    if (entriesSnapshot) {
      const monthSnapshot = await filterEntrySnapshotByUser(
        entriesSnapshot,
        start,
        end,
        user.uid
      );

      const hotDates = getHotDates(monthSnapshot);
      this.setState({ hotDates });
    }
  };

  showMoreEntries = async (currentEndTime: moment.Moment) => {
    const { entriesSnapshot, startTime } = this.state;
    const { user } = this.props;
    const endTime: moment.Moment = moment(currentEndTime).subtract(
      DISPLAY_INTERVAL_DAYS,
      "days"
    );

    if (entriesSnapshot) {
      this.setState({ isLoading: true });
      const snapshot = await filterEntrySnapshotByUser(
        entriesSnapshot,
        startTime,
        endTime,
        user.uid
      );

      const entries: firestore.DocumentData[] = [];
      snapshot.forEach((doc) => entries.push(doc.data()));

      this.setState({ entries, isLoading: false, endTime });
    }
  };

  handleNewEntryCreated = () => {
    goTo("/journal");
  };

  render() {
    const { entries, workouts, isLoading, endTime, startTime, hotDates } =
      this.state;
    const { userData, showAddEntry } = this.props;

    return (
      <>
        {showAddEntry && (
          <JournalEntry
            workouts={workouts}
            onNewEntryCreate={this.handleNewEntryCreated}
          />
        )}
        <h3>Your Journal</h3>
        <Calendar
          className="section"
          onChange={this.handleNewDateClick}
          onActiveStartDateChange={this.handleActiveStartDateChange}
          tileContent={({ date, view }) => (
            <CalendarTile
              date={date}
              view={view}
              hotDates={hotDates}
              workouts={workouts}
            />
          )}
          tileClassName={({ date, view }) =>
            getTileClassName(date, view, hotDates, workouts)
          }
        />
        <h4>{startTime.format("LL")}</h4>
        {entries.map((entry: Entry, index) => (
          <JournalEntryDisplay
            key={entry.id}
            {...entry}
            creator={userData}
            workout={findWorkoutById(entry.workoutRef.id, workouts)}
            showDelete={true}
          />
        ))}
        {isLoading ? (
          <img src={boney} alt="journal is loading" />
        ) : (
          <React.Fragment>
            {!entries.length && <p>No entries</p>}
            <button onClick={() => this.showMoreEntries(endTime)}>more</button>
          </React.Fragment>
        )}
      </>
    );
  }
}

type EntriesState = {
  cancelEntriesWatcher: () => void;
  entries: any[];
  isLoading: boolean;
  entriesSnapshot?: firestore.QuerySnapshot;
  endTime: moment.Moment;
  startTime: moment.Moment;
  users: {}; // keyed by user.id
  workouts: {}; // keyed by workout.id
};
// TODO refactor this with Journal
export class Entries extends React.Component<
  {
    cancelEntriesWatcher?: Promise<() => void>;
    initialEntriesSnapshot?: firestore.QuerySnapshot;
  },
  EntriesState
> {
  constructor(props) {
    super(props);
    let isLoading = props.initialEntriesSnapshot ? false : true;

    let cancelEntriesWatcher;
    watchEntries(this.handleEntriesChange).then((fn) => {
      cancelEntriesWatcher = fn;
      this.setState({ cancelEntriesWatcher });
    });

    this.state = {
      cancelEntriesWatcher: props.cancelEntriesWatcher || cancelEntriesWatcher,
      entries: props.initialEntriesSnapshot || [],
      users: {},
      workouts: {},
      entriesSnapshot: undefined,
      endTime: moment().subtract(DISPLAY_INTERVAL_DAYS, "days"),
      startTime: moment(), // now
      isLoading,
    };
  }

  componentWillUnmount() {
    this.state.cancelEntriesWatcher();
  }

  addUserToLookup = async (id) => {
    const user = await getUserById(id);
    this.setState({ users: { ...this.state.users, [id]: user } });
  };

  addWorkoutToLookup = async (id) => {
    const workout = await getWorkoutById(id);
    this.setState({ workouts: { ...this.state.workouts, [id]: workout } });
  };

  handleEntriesChange = async (entriesSnapshot: firestore.QuerySnapshot) => {
    const { endTime, startTime, users, workouts } = this.state;
    this.setState({ isLoading: true });

    const snapshot = await filterEntrySnapshot(
      entriesSnapshot,
      startTime,
      endTime
    );
    this.setState({
      entriesSnapshot: snapshot,
      endTime: moment(endTime).subtract(DISPLAY_INTERVAL_DAYS, "day"),
    });

    this.loadEntries(snapshot, users, workouts);
  };

  loadEntries = (entriesSnapshot, users, workouts) => {
    const entries: firestore.DocumentData[] = [];
    entriesSnapshot.forEach((doc) => {
      const entry = doc.data();
      const userId = entry.creatorRef.id;
      const workoutId = entry.workoutRef.id;
      const user = users[userId];
      const workout = workouts[workoutId];
      // I can't believe I have to do this manually
      if (!user && userId) {
        this.addUserToLookup(userId);
      }
      if (!workout && workoutId) {
        this.addWorkoutToLookup(workoutId);
      }
      entries.push(entry);
    });
    this.setState({
      entries,
      isLoading: false,
    });
  };

  showMoreEntries = async (currentEndTime: moment.Moment) => {
    const { entriesSnapshot, startTime, users, workouts } = this.state;
    const endTime: moment.Moment = moment(currentEndTime).subtract(
      DISPLAY_INTERVAL_DAYS,
      "days"
    );

    if (entriesSnapshot) {
      this.setState({ isLoading: true, endTime });
      const snapshot = await filterEntrySnapshot(
        entriesSnapshot,
        startTime,
        endTime
      );

      this.loadEntries(snapshot, users, workouts);
    }
  };

  render() {
    const { entries, isLoading, endTime, users, workouts } = this.state;

    return (
      <div>
        <EntriesDisplay entries={entries} users={users} workouts={workouts} />
        {isLoading ? (
          <img src={boney} alt="journal is loading" />
        ) : (
          <React.Fragment>
            {!entries.length && <p>No entries</p>}
            <button onClick={() => this.showMoreEntries(endTime)}>more</button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

type EntriesDisplayProps = {
  entries: any[];
  users: {}; // keyed by user.id
  workouts: {}; // keyed by workout.id
};
const EntriesDisplay = ({ entries, users, workouts }: EntriesDisplayProps) => (
  <React.Fragment>
    {entries.map((entry: Entry, index) => {
      return (
        <JournalEntryDisplay
          key={entry.id ? entry.id : index}
          {...entry}
          creator={users[entry.creatorRef.id]}
          workout={workouts[entry.workoutRef.id]}
        />
      );
    })}
  </React.Fragment>
);

type JournalEntryProps = {
  workouts: Array<Workout>;
  entry?: EntryType;
  onNewEntryCreate?: () => void;
};
type JournalEntryState = {
  error: string;
  workout?: Workout;
  date: Date;
  showCalendar: boolean;
};

class JournalEntry extends React.PureComponent<
  JournalEntryProps,
  JournalEntryState
> {
  state = {
    error: "",
    workout: undefined,
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

  setWorkout = (e, workout) => {
    e.preventDefault();
    this.setState({ workout });
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
    this.setState({ error: "", workout: undefined });
    event.target.reset();
    if (this.props.onNewEntryCreate) {
      this.props.onNewEntryCreate();
    }
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
    const { error, showCalendar, date, workout } = this.state;

    return (
      <Modal>
        {error && <p className="error">{error}</p>}
        <form onSubmit={this.handleCreateEntry}>
          <label>
            How did you grow today? 🌱
            <div
              style={{
                height: "36px",
                margin: " 8px 0",
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {workouts.map((workout) =>
                workout.isQuickadd ? (
                  <button
                    key={workout.id}
                    className="emoji"
                    onClick={(e) => this.setWorkout(e, workout)}
                  >
                    {workout.emoji}
                  </button>
                ) : null
              )}
            </div>
            <select
              name="exercise"
              id="exercise-select"
              onChange={this.selectWorkout}
              value={workouts.findIndex((w) => w.id === workout?.id)}
            >
              <option value=""></option>
              {workouts.map((workout: Workout, index) => {
                return (
                  <option key={workout.id} value={index}>
                    {workout.title}
                    {workout.emoji && ` ${workout.emoji}`}
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
            <div style={{ position: "absolute" }}>
              <Calendar onChange={this.handleCalendarChange} value={date} />
            </div>
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
              style={{ height: "6em" }}
            />
          </label>
          <button type="submit">write in your journal</button>
        </form>
      </Modal>
    );
  }
}

const JournalEntryDisplay = ({
  id,
  content,
  title,
  workout,
  entryTime,
  creator,
  showDelete,
}: {
  id: string;
  title: string;
  workout?: Workout;
  entryTime: Date;
  creator?: User;
  content?: string;
  showDelete?: boolean;
}) => {
  const handleDeleteEntry = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (window.confirm("Are you sure you wish to delete this entry?")) {
      deleteJournalEntry(id);
    }
  };

  return (
    <section className="card">
      <div className="badge-menu-wrapper">
        <UserBadge
          {...creator}
          size={34}
          subtitle={entryTime.toLocaleString()}
          noun={`${workout && workout.emoji ? workout.emoji + " " : ""}${
            workout ? workout.title : ""
          }`}
        />
        {id && showDelete && (
          <button className="text-button" onClick={handleDeleteEntry}>
            x
          </button>
        )}
      </div>
      <div className="card-content">
        <h4>{title}</h4>
        {content && <p>{content}</p>}
      </div>
    </section>
  );
};
