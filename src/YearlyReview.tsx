import React from "react";
import { firestore } from "firebase";
import moment from "moment";
import { Workout, YearlyReview, FirestoreUser } from "./types";
import {
  watchWorkouts,
  watchYearlyReview,
  createYearlyReview,
} from "./Database";

const LAST_YEAR = 2020;

type ReviewState = {
  workouts: Array<Workout>;
  yearlyReview?: YearlyReview;
  cancelWorkoutsWatcher: () => void;
  cancelYearlyReviewWatcher: () => void;
};
export default class Review extends React.Component<
  {
    user: FirestoreUser;
  },
  ReviewState
> {
  state = {
    workouts: [],
    cancelWorkoutsWatcher: () => {},
    cancelYearlyReviewWatcher: () => {},
    yearlyReview: undefined,
  };

  constructor(props) {
    super(props);
    let cancelWorkoutsWatcher;
    watchWorkouts(this.handleWorkoutsChange, props.user.uid).then((fn) => {
      cancelWorkoutsWatcher = fn;
      this.setState({ cancelWorkoutsWatcher });
    });

    let cancelYearlyReviewWatcher;
    watchYearlyReview(
      this.handleYearlyReviewChange,
      props.user.uid,
      LAST_YEAR
    ).then((fn) => {
      cancelYearlyReviewWatcher = fn;
      this.setState({ cancelYearlyReviewWatcher });
    });
  }

  componentWillUnmount() {
    this.state.cancelWorkoutsWatcher();
    this.state.cancelYearlyReviewWatcher();
  }

  handleWorkoutsChange = (workouts: Array<Workout>) => {
    this.setState({ workouts });
  };

  handleYearlyReviewChange = async (
    reviewsSnapshot: firestore.QuerySnapshot
  ) => {
    const reviews: YearlyReview[] = [];
    reviewsSnapshot.forEach((doc) => reviews.push(doc.data() as YearlyReview));

    if (!reviews.length) {
      createYearlyReview(this.props.user.uid, LAST_YEAR);
    } else if (reviews.length === 1) {
      this.setState({ yearlyReview: reviews[0] });
    } else {
      console.log(
        "something is wrong, there should only be one review per year. TODO implement error reporting haha"
      );
    }
  };

  countWorkouts = (workouts, workoutTotals): Array<WorkoutSummary> => {
    if (!workoutTotals || !Object.keys(workoutTotals)) {
      return [];
    }

    const workoutsWithCounts: Array<any> = [];
    workouts.forEach((workout) => {
      const w = workout as Workout;
      if (w.id) {
        const data: WorkoutSummary = {
          workout: w,
          yearCount: workoutTotals[w.id] || 0,
        };
        workoutsWithCounts.push(data);
      } else {
        console.log("can't process workout, id is missing.");
      }
    });

    workoutsWithCounts.sort(
      (a: WorkoutSummary, b: WorkoutSummary) => b.yearCount - a.yearCount
    );

    return workoutsWithCounts;
  };

  render() {
    const { yearlyReview, workouts } = this.state;
    const workoutTotals = yearlyReview ? yearlyReview.workoutTotals : {};
    const workoutSummaries = this.countWorkouts(workouts, workoutTotals);

    return (
      <React.Fragment>
        <section>
          <div className="banner" style={{ padding: "15px" }}>
            <h2>Your year in review 🎉</h2>
            {yearlyReview && (
              <p>
                {yearlyReview.year} was kind of a lot. Here's how you grew
                despite everything:
              </p>
            )}
          </div>
          {workoutSummaries.map((summary) => (
            <WorkoutReport key={summary.workout.id} summary={summary} />
          ))}
        </section>
      </React.Fragment>
    );
  }
}
type WorkoutSummary = {
  workout: Workout;
  yearCount: number;
};

const WorkoutReport = ({ summary }: { summary: WorkoutSummary }) => {
  const weeklyAverage = (
    summary.yearCount / moment([LAST_YEAR]).weeksInYear()
  ).toFixed(1);
  return (
    <div>
      <h4>{summary.workout.title}</h4>
      <p>💪 you did this {summary.yearCount} times</p>
      <p>
        🌱 which is {weeklyAverage} times per week.
        {weeklyAverage > 1 && " Nice!!"}
      </p>
    </div>
  );
};
