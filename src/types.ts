import { firestore } from "firebase/app"; // types

export type User = {
  displayName: string;
  imgSrc: string;
  username: string;
  updated?;
};

export type Encouragement = {
  id?: string;
  text: string;
  editor;
  created: Date;
};
