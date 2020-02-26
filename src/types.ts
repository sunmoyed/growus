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
  color: string; // TODO validate
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
  entryTime: firestore.Timestamp;
  created?: firestore.Timestamp;
};
