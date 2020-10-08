import { firestore } from "firebase";
import { User, Workout } from "./types";

export class Entry {
  readonly created: Date;
  readonly entryTime: Date;
  creator?: User;
  workout?: Workout;

  constructor(
    readonly content: string,
    created: firestore.Timestamp,
    readonly creatorRef: firestore.DocumentReference,
    entryTime: firestore.Timestamp,
    readonly title: string,
    readonly workoutRef: firestore.DocumentReference,
    readonly id: string
  ) {
    this.created = created.toDate();
    this.entryTime = entryTime.toDate();

    // // get user
    // // this doesn't work with react state because it mutates object and doesn't rerender components.
    // creatorRef.get().then((res) => {
    //   const data = res.data() || {};
    //   console.log("got user data", data);

    //   this.creator = {
    //     about: data.about,
    //     berry: data.berry,
    //     created: data.create,
    //     displayName: data.displayName,
    //     goals: data.goals,
    //     imgSrc: data.imgSrc,
    //     updated: data.updated,
    //     username: data.username,
    //   };
    // });

    // // get workout
    // workoutRef.get().then((res) => {
    //   const data = res.data() || {};
    //   this.workout = {
    //     color: data.color,
    //     description: data.description,
    //     exercises: data.exercises,
    //     title: data.title,
    //     userid: data.userid,
    //   };
    // });
  }

  toString(): string {
    return this.title;
  }
}

// https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter
export const entryConverter = {
  toFirestore(entry: Entry): firebase.firestore.DocumentData {
    return {};
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Entry {
    const data = snapshot.data(options)!;
    return new Entry(
      data.content,
      data.created,
      data.creator,
      data.entryTime,
      data.title,
      data.workout,
      snapshot.id
    );
  },
};

export default {};
