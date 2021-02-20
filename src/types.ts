import { firestore, User as FUser } from "firebase/app"; // types

export type FirestoreUser = FUser;

export type User = {
  imgSrc: string;
  username: string;
  displayName?: string;
  about?: string;
  goals?: string;
  berry?: string;
  created?: firestore.Timestamp;
  updated?: firestore.Timestamp;
};

export type EncouragementData = {
  text: string;
  editor;
  created: firestore.Timestamp;
};

export type Encouragement = EncouragementData & {
  id: string;
};

export type Exercise = {
  name: string;
  description?: string;
  category?: string;
  userid: string;
  creator?;
  id?: string;
};

export type Workout = {
  title: string;
  description?: string;
  exercises: Array<string>;
  userid: string;
  id?: string;
  color?: string; // deprecated
  emoji?: string; // the ? exists because of schema change.
  isQuickadd?: boolean;
  isPhysicalActivity?: boolean;
  hasUnitHueco?: boolean;
  hasUnitMiles?: boolean;
  hasUnitMinutes?: boolean;
  hasUnitReps?: boolean;
  hasUnitVerticalFeet?: boolean;
  hasUnitYDS?: boolean;
};

export type EntryFirebase = {
  title: string;
  content?: string;
  workout;
  // workout: firestore.DocumentReference | Workout;
  userid: string;
  creator?;
  id?: string;
  entryTime: firestore.Timestamp;
  created?: firestore.Timestamp;
};

export type Entry = {
  title: string;
  content?: string;
  workout;
  // workout: firestore.DocumentReference | Workout;
  userid: string;
  creator?;
  id?: string;
  entryTime: Date;
  created?: Date;
  unitHueco?: number; // vB -> -1, v0 -> 0, v1 -> 1...
  unitMiles?: number;
  unitMinutes?: number;
  unitReps?: number;
  unitVerticalFeet?: number;
  unitYDS?: string; // I don't know yet :'D
};

export type YearlyReviewFirebase = {
  updated: firestore.Timestamp;
  workoutTotals: {
    // [WorkoutID]: Number; // TODO
  };
  userid?: String;
  creator?: firestore.DocumentReference;
  year: Number;
};

export type YearlyReview = {
  updated: Date;
  workoutTotals: {
    // [WorkoutID]: Number; // TODO
  };
  userid?: String; // for filtering on the firestore console, since you can't filter by reference there
  creator?;
  year: Number;
};
