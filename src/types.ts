import { firestore } from "firebase/app"; // types

export type User = {
  displayName: string;
  imgSrc: string;
  username: string;
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
