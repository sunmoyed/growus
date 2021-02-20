import React from "react";
import Calendar from "react-calendar";
import Modal from "./Modal";
import { Workout, Entry as EntryType } from "./types";
import { createJournalEntry } from "./Database";

type CreateEntryModalProps = {
  workouts: Array<Workout>;
  entry?: EntryType;
  onNewEntryCreate?: () => void;
};
type CreateEntryModalState = {
  error: string;
  workout?: Workout;
  date: Date;
  showCalendar: boolean;
};

export default class CreateEntryModal extends React.PureComponent<
  CreateEntryModalProps,
  CreateEntryModalState
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
                margin: "8px 0",
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
          <label>
            Reps
            <div>
              <input
                className="measurement-number-short"
                type="number"
                name="measurement-reps"
              />
            </div>
          </label>
          <label>
            Hueco
            <div>
              <div className="measurement-hueco-wrapper">
                <input
                  className="measurement-hueco"
                  type="number"
                  name="measurement-hueco"
                  min="0"
                  max="15"
                />
              </div>
            </div>
          </label>
          <button type="submit">write in your journal</button>
        </form>
      </Modal>
    );
  }
}
