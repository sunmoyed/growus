import React from "react";
import Profile from "./Profile";
import Encouragements, {
  RandomEncouragement,
  AddEncouragement
} from "./Encouragement";
import Exercises from "./Exercises";
import Workouts from "./Workouts";
import Journal, { GroupJournal } from "./Journal";
import { Link } from "./History";

const Home = props => (
  <div>
    <Navigation page={props.page} />
    <RandomEncouragement />
    <Page {...props} />
  </div>
);

export default Home;

const Page = ({ page, props }) => {
  switch (page) {
    case "journal":
      return (
        <div>
          <Journal {...props} />
        </div>
      );
    case "profile":
      return (
        <div>
          <Profile {...props} />
        </div>
      );
    case "encouragements":
      return (
        <div>
          <Encouragements />
          <AddEncouragement />
        </div>
      );
    case "exercises":
      return (
        <div>
          <Exercises />
        </div>
      );
    case "workouts":
      return (
        <div>
          <Workouts />
        </div>
      );
    case "":
    default:
      return (
        <div>
          <GroupJournal />
        </div>
      );
  }
};

const Navigation = ({ page }) => (
  <div className="list-row">
    <Link href="/journal" selected={page === "journal"}>
      journal
    </Link>
    <Link href="/workouts" selected={page === "workouts"}>
      workouts
    </Link>
    <Link href="/encouragements" selected={page === "encouragements"}>
      encouragements
    </Link>
    <Link href="/exercises" selected={page === "exercises"}>
      exercises
    </Link>
  </div>
);
