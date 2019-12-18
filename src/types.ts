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
};

export type Workout = {
  name: string;
  description?: string;
  exercises: Exercise[];
};
