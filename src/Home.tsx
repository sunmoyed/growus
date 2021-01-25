import React from "react";
import { User as FirebaseUser } from "firebase/app";

import Profile from "./Profile";
import Encouragements, {
  RandomEncouragement,
  AddEncouragement,
} from "./Encouragement";
import Exercises from "./Exercises";
import Workouts from "./Workouts";
import Journal, { Entries } from "./Journal";
import YearlyReview from "./YearlyReview";
import { Link, LinkButton } from "./History";
import { User } from "./types";

export type PageProps = {
  user: FirebaseUser;
  userData: User;
  page: string;
  subpaths: Array<string>;
};

const Home = (props: PageProps) => (
  <div>
    <Navigation page={props.page} />
    <RandomEncouragement />
    <Page {...props} subpaths={getSubpaths(window.location.pathname)} />
    <NewEntryButton
      page={props.page}
      subpaths={getSubpaths(window.location.pathname)}
    />
  </div>
);

export default Home;

const Page = ({ page, ...props }: PageProps) => {
  switch (page) {
    case "journal":
      return (
        <div>
          <Journal {...props} showAddEntry={props.subpaths[0] === "new"} />
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

const NewEntryButton = ({
  page,
  subpaths,
}: {
  page: string;
  subpaths: Array<string>;
}) => (
  <LinkButton
    style={{
      position: "fixed",
      bottom: 0,
      right: 0,
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      color: "var(--text-muted)",
      background: "var(--new-entry-button)",
      padding: 0,
      zIndex: 2001,
    }}
    href={isNewEntryPage(page, subpaths) ? "/journal" : "/journal/new"}
  >
    {isNewEntryPage(page, subpaths) ? "x" : "+🌱"}
  </LinkButton>
);

function getSubpaths(pathname: string): Array<string> {
  return pathname.split("/").slice(2);
}

function getProfilePage(subpaths: Array<string>): string {
  return subpaths[0] || "";
}

function isNewEntryPage(page, subpaths): boolean {
  return page === "journal" && subpaths[0] === "new";
}
