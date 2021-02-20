import React, { useRef, useState, useEffect } from "react";
import { EmojiButton } from "@joeattardi/emoji-button";
import { Exercise, Workout, User } from "./types";
import {
  watchExercises,
  watchWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} from "./Database";
import { ExerciseList } from "./Exercises";

function sortExercises(ids: Array<string>, bank: Array<Exercise>) {
  const availableExercises: Array<Exercise> = [];
  const workoutExercises: Array<Exercise> = [];
  bank.forEach((exercise) => {
    if (exercise.id && ids.includes(exercise.id)) {
      workoutExercises.push(exercise);
    } else {
      availableExercises.push(exercise);
    }
  });

  return [availableExercises, workoutExercises];
}

type WorkoutsProps = {
  userData: User;
};

type WorkoutsState = {
  cancelWorkoutsWatcher: () => void;
  exerciseBank: Array<Exercise>;
  workouts: Array<Workout>;
};

export default class Workouts extends React.PureComponent<
  WorkoutsProps,
  WorkoutsState
> {
  constructor(props) {
    super(props);
    let cancelWorkoutsWatcher;
    watchExercises(this.handleExercisesChange);
    watchWorkouts(this.handleWorkoutsChange, props.user.uid).then((fn) => {
      cancelWorkoutsWatcher = fn;
      this.setState({ cancelWorkoutsWatcher });
    });

    this.state = {
      cancelWorkoutsWatcher,
      exerciseBank: [],
      workouts: [],
    };
  }

  componentWillUnmount() {
    this.state.cancelWorkoutsWatcher();
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
      <React.Fragment>
        <section>
          <h3>New workout</h3>
          <EditWorkout exerciseBank={exerciseBank} />
        </section>
        <section>
          <h3>Your workouts :)</h3>
          {workouts.map((workout: Workout) => (
            <EditWorkout
              key={workout.title}
              workout={workout}
              exerciseBank={exerciseBank}
            />
          ))}
        </section>
      </React.Fragment>
    );
  }
}

class EditWorkout extends React.PureComponent<
  { workout?: Workout; exerciseBank: Array<Exercise> },
  { error: string; exercises: Array<string>; emoji: string; touched: boolean }
> {
  state = {
    emoji: this.props.workout?.emoji || randomEmoji(),
    error: "",
    exercises: this.props.workout ? this.props.workout.exercises : [],
    touched: false,
  };

  constructor(props) {
    super(props);

    // If there wasn't an emoji assigned to this workout, add a random one.
    if (this.props.workout?.id && !this.props.workout?.emoji) {
      this.addEmojiToWorkout();
    }
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeunload.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeunload.bind(this));
  }

  beforeunload(e) {
    // create warning popup if there's unsaved workouts
    if (this.state.touched) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  addEmojiToWorkout() {
    const { workout } = this.props;
    if (!workout) {
      return;
    }
    const { color, title, description, exercises } = workout || {};
    updateWorkout(workout.id, {
      color,
      title,
      description,
      exercises,
      emoji: this.state.emoji,
    });
  }

  addExercise = (event) => {
    const exerciseID = event.target.value;
    if (exerciseID) {
      this.setState((state) => {
        const exercises = state.exercises.slice();
        const duplicate = exercises.includes(exerciseID);
        if (!duplicate) {
          exercises.push(exerciseID);
        }

        return { exercises, touched: true };
      });

      event.target.selectedIndex = null;
    }
  };

  removeExercise = (id) => {
    const { exercises } = this.state;
    var index = exercises.indexOf(id);
    if (index > -1) {
      const newExercises = exercises.slice();
      newExercises.splice(index, 1);

      this.setState({ exercises: newExercises, touched: true });
    }
  };

  handleCreateWorkout = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = form.get("title");
    if (!title) {
      this.setState({ error: "The workout needs a title" });
      return;
    }

    const description = form.get("description");

    const isQuickadd = form.get("is-quickadd");
    const isPhysicalActivity = form.get("is-physical-activity");

    const hasUnitHueco = form.get("has-unit-hueco");
    const hasUnitMiles = form.get("has-unit-miles");
    const hasUnitMinutes = form.get("has-unit-minutes");
    const hasUnitReps = form.get("has-unit-reps");
    const hasUnitVerticalFeet = form.get("has-unit-vertical-feet");
    const hasUnitYDS = form.get("has-unit-yds");

    const { workout } = this.props;
    const { emoji, exercises } = this.state;

    if (workout?.id) {
      await updateWorkout(workout.id, {
        title,
        description,
        exercises,
        emoji,
        isQuickadd,
        isPhysicalActivity,
        hasUnitHueco,
        hasUnitMiles,
        hasUnitMinutes,
        hasUnitReps,
        hasUnitVerticalFeet,
        hasUnitYDS,
      });
      this.setState({ error: "", touched: false });
    } else {
      createWorkout(
        title,
        description,
        exercises,
        emoji,
        isQuickadd,
        isPhysicalActivity,
        hasUnitHueco,
        hasUnitMiles,
        hasUnitMinutes,
        hasUnitReps,
        hasUnitVerticalFeet,
        hasUnitYDS
      );
      this.setState({ error: "", touched: false });
      event.target.reset();
    }
  };

  handleDeleteWorkout = async (e) => {
    const { workout } = this.props;

    if (window.confirm("Are you sure you wish to delete this workout?")) {
      deleteWorkout(workout?.id);
    }
  };

  handleEmojiSelect = (emoji: string) =>
    this.setState({ emoji, touched: true });

  handleChange = () => this.setState({ touched: true });

  render() {
    const { exerciseBank, workout } = this.props;
    const { emoji, error, exercises, touched } = this.state;
    const [availableExercises, workoutExercises] = sortExercises(
      exercises,
      exerciseBank
    );

    return (
      <section className="workout">
        {error && <p className="error">{error}</p>}
        <div className="workout-badge">
          <EmojiPicker
            initialEmoji={emoji}
            onEmojiSelect={this.handleEmojiSelect}
          />
          <form onSubmit={this.handleCreateWorkout}>
            <section>
              <label>
                <input
                  type="text"
                  name="title"
                  defaultValue={workout && workout.title}
                  placeholder="workout name"
                  onChange={this.handleChange}
                />
              </label>
              <label>
                <input
                  type="text"
                  name="description"
                  defaultValue={workout && workout.description}
                  placeholder="workout description"
                  onChange={this.handleChange}
                />
              </label>
            </section>
            <section>
              <h4>Exercises</h4>
              {workoutExercises.length > 0 && (
                <ExerciseList
                  exercises={workoutExercises}
                  onDelete={this.removeExercise}
                />
              )}
              <label>
                <select
                  name="exercise"
                  id={`exercise-select-${workout?.id}`}
                  onChange={this.addExercise}
                >
                  <option value="">add exercises</option>
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
            </section>
            <section>
              <h4>Configuration</h4>
              <label>
                <input
                  type="checkbox"
                  name="is-quickadd"
                  defaultChecked={workout?.isQuickadd}
                  onChange={this.handleChange}
                />
                journal shortcut
              </label>
              <label>
                <input
                  type="checkbox"
                  name="is-physical-activity"
                  // If this is a new workout, check by default.
                  // Otherwise, check is whatever the workout is configured as.
                  defaultChecked={!workout ? true : workout?.isPhysicalActivity}
                  onChange={this.handleChange}
                />
                count towards daily movement
              </label>
            </section>
            <section>
              <h4>Measurement</h4>
              <label>
                <input
                  type="checkbox"
                  name="has-unit-hueco"
                  defaultChecked={workout?.hasUnitHueco}
                  onChange={this.handleChange}
                />
                Hueco (v0, v1...)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="has-unit-miles"
                  defaultChecked={workout?.hasUnitMiles}
                  onChange={this.handleChange}
                />
                Miles
              </label>
              <label>
                <input
                  type="checkbox"
                  name="has-unit-minutes"
                  defaultChecked={workout?.hasUnitMinutes}
                  onChange={this.handleChange}
                />
                Minutes
              </label>
              <label>
                <input
                  type="checkbox"
                  name="has-unit-reps"
                  defaultChecked={workout?.hasUnitReps}
                  onChange={this.handleChange}
                />
                Reps
              </label>
              <label>
                <input
                  type="checkbox"
                  name="has-unit-vertical-feet"
                  defaultChecked={workout?.hasUnitVerticalFeet}
                  onChange={this.handleChange}
                />
                Vertical feet
              </label>
              <label>
                <input
                  type="checkbox"
                  name="has-unit-vertical-yds"
                  defaultChecked={workout?.hasUnitYDS}
                  onChange={this.handleChange}
                />
                YDS (5.9, 5.10a...)
              </label>
            </section>
            <div>
              <button
                className={touched ? "primary" : ""}
                type="submit"
                disabled={!touched}
              >
                {workout?.id ? "update" : "create"}
              </button>
              {workout?.id && (
                <button onClick={this.handleDeleteWorkout}>delete</button>
              )}
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export const WorkoutLabel = ({ workout }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {workout.emoji}
    <span style={{ marginLeft: "6px" }}> {workout.title}</span>
  </div>
);

type TODO = any;

function EmojiPicker({
  initialEmoji,
  onEmojiSelect,
}: {
  initialEmoji: string;
  onEmojiSelect?: (emoji: string) => void;
}) {
  const buttonRef = useRef<TODO>();
  const [picker, setPicker] = useState<EmojiButton | null>(null);
  const [emoji, setEmoji] = useState<string>(initialEmoji);

  useEffect(() => {
    const pickerObj = new EmojiButton({ style: "native" });

    pickerObj.on("emoji", (selection) => {
      setEmoji(selection.emoji);
      onEmojiSelect && onEmojiSelect(selection.emoji as string);
    });

    setPicker(pickerObj);
  }, [onEmojiSelect]);

  function togglePicker() {
    if (picker) {
      picker.togglePicker(buttonRef.current);
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={togglePicker}
      style={{ padding: "10px 15px" }}
    >
      <span style={{ fontSize: "24px" }}>{emoji}</span>
    </button>
  );
}

function randomEmoji(): string {
  const emojis = [
    "🐶",
    "🐺",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🐸",
    "🐯",
    "🐨",
    "🐻",
    "🐷",
    "🐽",
    "🐮",
    "🐗",
    "🐵",
    "🐒",
    "🐴",
    "🐑",
    "🐘",
    "🐼",
    "🐧",
    "🐦",
    "🐤",
    "🐥",
    "🐣",
    "🐔",
    "🐍",
    "🐢",
    "🐛",
    "🐝",
    "🐜",
    "🐞",
    "🐌",
    "🐙",
    "🐚",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🐄",
    "🐏",
    "🐀",
    "🐃",
    "🐅",
    "🐇",
    "🐉",
    "🐎",
    "🐐",
    "🐓",
    "🐕",
    "🐖",
    "🐁",
    "🐂",
    "🐲",
    "🐡",
    "🐊",
    "🐫",
    "🐪",
    "🐆",
    "🐈",
    "🐩",
    "🐾",
    "💐",
    "🌸",
    "🌷",
    "🍀",
    "🌹",
    "🌻",
    "🌺",
    "🍁",
    "🍃",
    "🍂",
    "🌿",
    "🌾",
    "🍄",
    "🌵",
    "🌴",
    "🌲",
    "🌳",
    "🌼",
    "🏇",
    "🏆",
    "🎿",
    "🏂",
    "🏊",
    "🏄",
    "🎣",
    "☕",
    "🍵",
    "🍶",
    "🍼",
    "🍺",
    "🍻",
    "🍸",
    "🍹",
    "🍷",
    "🍴",
    "🍕",
    "🍔",
    "🍟",
    "🍗",
    "🍖",
    "🍝",
    "🍛",
    "🍤",
    "🍱",
    "🍣",
    "🍥",
    "🍙",
    "🍘",
    "🍚",
    "🍜",
    "🍲",
    "🍢",
    "🍡",
    "🍳",
    "🍞",
    "🍩",
    "🍮",
    "🍦",
    "🍨",
    "🍧",
    "🎂",
    "🍰",
    "🍪",
    "🍫",
    "🍬",
    "🍭",
    "🍯",
    "🍎",
    "🍏",
    "🍊",
    "🍋",
    "🍒",
    "🍇",
    "🍉",
    "🍓",
    "🍑",
    "🍈",
    "🍌",
    "🍐",
    "🍍",
    "🍠",
    "🍆",
    "🍅",
    "🌽",
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
}
