import React from "react";
import { User as FirebaseUser } from "firebase/app";

import Profile from "./Profile";
import Encouragements, {
  RandomEncouragement,
  AddEncouragement
} from "./Encouragement";
import Exercises from "./Exercises";
import Workouts from "./Workouts";
import Journal, { Entries } from "./Journal";
import YearlyReview from "./YearlyReview";
import { Link } from "./History";
import { User } from "./types";

export type PageProps = {
  user: FirebaseUser;
  userData: User;
  page: string;
  subpaths: Array<string>;
};

const Home = (props: PageProps) => (
  <div>
    {props.page !== "yearlyreview" && <YearInReviewBanner />}
    <Navigation page={props.page} />
    <RandomEncouragement />
    <Page {...props} subpaths={getSubpaths(window.location.pathname)} />
  </div>
);

export default Home;

const Page = ({ page, ...props }: PageProps) => {
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
          {props.userData && (
            <Profile {...props} profilePage={getProfilePage(props.subpaths)} />
          )}
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
          <Workouts {...props} />
        </div>
      );
    case "yearlyreview":
      return (
        <div>
          <YearlyReview {...props} />
        </div>
      );
    case "":
      // TODO the group journal should show the next n entries, rather than by time window.
      return (
        <div>
          <Entries />
        </div>
      );
    default:
      return <div>nothing to see here :^)</div>;
  }
};

const YearInReviewBanner = () => (
  <div className="banner">
    Check out your <Link href="/yearlyreview">2020 year of growing</Link> 🌱
  </div>
);

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

function getSubpaths(pathname: string): Array<string> {
  return pathname.split("/").slice(2);
}

function getProfilePage(subpaths: Array<string>): string {
  return subpaths[0] || "";
}
