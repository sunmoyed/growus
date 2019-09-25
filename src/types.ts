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
