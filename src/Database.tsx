import { firebaseApp } from "./Auth";
import { firestore } from "firebase/app"; // types
import { User as FirebaseUser } from "firebase/app";
import {
  EncouragementData,
  User,
  Exercise,
  Workout,
  EntryFirebase,
  YearlyReviewFirebase,
} from "./types";
import moment from "moment";

import { entryConverter, yearlyReviewConverter } from "./Classes";

const EMPTY_USER: User = {
  username: "",
  imgSrc: "",
};

interface refsType {
  users: firestore.CollectionReference;
  encouragements: firestore.CollectionReference;
  user: firestore.DocumentReference | undefined;
  exercises: firestore.CollectionReference;
  workouts: firestore.CollectionReference;
  entries: firestore.CollectionReference;
  yearlyReviews: firestore.CollectionReference;
}

export const db = firebaseApp.firestore();

let REFS: refsType = {
  users: db.collection("users"),
  encouragements: db.collection("encouragements"),
  exercises: db.collection("exercises"),
  workouts: db.collection("workouts"),
  entries: db.collection("entries"),
  yearlyReviews: db.collection("yearlyReviews"),

  user: undefined,
};

export async function createUser(user: FirebaseUser) {
  const accountInfo = {
    ...getProfileInfoFromProvider(user),
    created: currentTime(),
  };
  console.log(accountInfo);

  REFS.user = await REFS.users.doc(user.uid);
  REFS.user.set(accountInfo);
  return getDoc(REFS.user);
}

export async function updateUser(uid, data) {
  const accountInfo = {
    ...data,
    updated: currentTime(),
  };

  const userRef = REFS.user || (await REFS.users.doc(uid));
  userRef.update(accountInfo);

  return getDoc(REFS.user);
}

export async function getUser(user: FirebaseUser) {
  if (!user) {
    return null;
  }
  REFS.user = await REFS.users.doc(user.uid);
  return getDoc(REFS.user);
}

export async function getUserByUsername(
  username: string
): Promise<User | undefined> {
  const snapshot = await REFS.users.where("username", "==", username).get();

  const result: any = await snapshotToList(snapshot);
  return result[0];
}

export async function getUserById(id: string) {
  const userRef = await REFS.users.doc(id);
  return getDoc(userRef);
}

function getUserRefById(uid: string) {
  return REFS.users.doc(uid);
}

export async function getWorkoutById(id: string) {
  const workoutRef = await REFS.workouts.doc(id);
  return getDoc(workoutRef);
}

function getProfileInfoFromProvider(user: FirebaseUser | null): User {
  if (user) {
    return {
      username: user.email || "",
      displayName: user.displayName || "",
      imgSrc: user.photoURL || "",
    };
  }
  return EMPTY_USER;
}

export async function createEncouragement(text) {
  const data: EncouragementData = {
    text,
    editor: REFS.user,
    created: currentTime(),
  };

  REFS.encouragements.add({ ...data });
  // note: add returns a ref that you can use:
  // const encouragementRef = await REFS.encouragements.add({ ...data });
}

export async function deleteEncouragement(id) {
  REFS.encouragements.doc(id).delete();
}

export async function watchEncouragements(onEncouragementsChange) {
  await REFS.encouragements.orderBy("text", "desc").get();

  REFS.encouragements.onSnapshot((snapshot) => {
    snapshot.query
      .orderBy("text", "desc")
      .get()
      .then((result) =>
        snapshotToList(result).then((list) => {
          onEncouragementsChange(list);
        })
      );
  });
}

export async function watchExercises(onExercisesChange) {
  REFS.exercises.onSnapshot((snapshot) => {
    snapshot.query
      .where("creator", "==", REFS.user)
      .get()
      .then((result) =>
        snapshotToList(result).then((list) => {
          onExercisesChange(list);
        })
      );
  });
}

export async function createExercise(name, description) {
  const data: Exercise = {
    name: name,
    description: description,
    userid: REFS.user ? REFS.user.id : "",
    creator: REFS.user,
  };
  REFS.exercises.add({ ...data });
}

export async function watchWorkouts(onWorkoutsChange, uid: string) {
  return (
    REFS.workouts
      // this doesn't work because firestore's orderby is case sensitive.
      // Sort in the browser instead.
      // .orderBy("title", "asc")
      .where("userid", "==", uid)
      .onSnapshot((snapshot) => {
        const workouts: firestore.DocumentData[] = [];
        snapshot.forEach((doc) => {
          const workout = doc.data();
          workout.id = doc.id;
          workouts.push(workout);
        });

        // alphebetize list, case in-sensitive.
        workouts.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );

        onWorkoutsChange(workouts as Array<Workout>);
      })
  );
}

export async function createWorkout(
  title,
  description,
  exercises,
  emoji,
  isQuickadd,
  isPhysicalActivity
) {
  const data: Workout = {
    title: title,
    description: description,
    exercises: exercises, // TODO should be references
    userid: REFS.user ? REFS.user.id : "",
    emoji,
    isQuickadd,
    isPhysicalActivity,
  };
  REFS.workouts.add({ ...data });
}

export async function updateWorkout(id, data) {
  const workoutData = {
    ...data,
    updated: currentTime(),
  };

  REFS.workouts.doc(id).update(workoutData);
}

// returns a watcher cancelling function
export async function watchEntries(onEntriesChange, uid?: string | undefined) {
  if (!uid) {
    return await REFS.entries
      .orderBy("entryTime", "desc")
      .onSnapshot((snapshot) => onEntriesChange(snapshot));
  } else {
    return await REFS.entries
      .orderBy("entryTime", "desc")
      .where("userid", "==", uid)
      .onSnapshot((snapshot) => onEntriesChange(snapshot));
  }
}

// returns a watcher cancelling function
export async function watchYearlyReview(
  onYearlyReviewChange,
  uid,
  year: number
) {
  const userRef = REFS.user || getUserRefById(uid);

  return REFS.yearlyReviews
    .where("creator", "==", userRef)
    .where("year", "==", year)
    .onSnapshot(async (snapshot) =>
      onYearlyReviewChange(
        await snapshot.query.withConverter(yearlyReviewConverter).get()
      )
    );
}

// creates a yearly review for 2020.
export async function createYearlyReview(uid, year) {
  const userRef = REFS.user || getUserRefById(uid);

  const entriesSnapshot: firestore.QuerySnapshot = await REFS.entries
    .orderBy("entryTime", "desc")
    .where("userid", "==", uid)
    .startAt(moment([year]).endOf("year").toDate())
    .endAt(moment([year]).startOf("year").toDate())
    .withConverter(entryConverter)
    .get();

  const entries: firestore.DocumentData[] = [];
  entriesSnapshot.forEach((doc) => entries.push(doc.data()));

  const workoutTotals = {};
  entries.forEach((entry) => {
    const workoutId = entry.workoutRef.id;
    const count = workoutTotals[workoutId] || 0;
    workoutTotals[workoutId] = count + 1;
  });

  const data: YearlyReviewFirebase = {
    year,
    updated: currentTime(),
    workoutTotals,
    userid: uid,
    creator: userRef,
  };

  REFS.yearlyReviews.add({ ...data });
}

// Use this to get ALL entries within a timeframe
export async function filterEntrySnapshot(
  snapshot: firestore.QuerySnapshot,
  startTime: moment.Moment,
  endTime: moment.Moment
): Promise<firestore.QuerySnapshot> {
  return await snapshot.query
    .startAt(startTime.endOf("day").toDate())
    .endAt(endTime.startOf("day").toDate())
    .withConverter(entryConverter)
    .get();
}

// Use this to get entries within a timeframe by userId
export async function filterEntrySnapshotByUser(
  snapshot: firestore.QuerySnapshot,
  startTime: moment.Moment, // more recent time
  endTime: moment.Moment, // less recent time
  id
) {
  return await snapshot.query
    .where("userid", "==", id)
    .startAt(startTime.endOf("day").toDate())
    .endAt(endTime.startOf("day").toDate())
    .withConverter(entryConverter)
    .get();
}

export async function createJournalEntry(title, content, workout, date) {
  const data: EntryFirebase = {
    title,
    content,
    workout: REFS.workouts.doc(workout.id), // TODO shoule be pointer instead of instance
    entryTime: date,
    created: currentTime(),
    userid: REFS.user ? REFS.user.id : "", // TODO reconcile userid and creator
    creator: REFS.user,
  };
  REFS.entries.add({ ...data });
}

export async function deleteJournalEntry(id) {
  REFS.entries.doc(id).delete();
}

export async function deleteWorkout(id) {
  REFS.workouts.doc(id).delete();
}

async function getDoc(ref) {
  try {
    const doc = await ref.get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  } catch (err) {
    console.log(err);
  }
}

async function snapshotToList(snapshot: firestore.QuerySnapshot | null) {
  if (snapshot === null) {
    return;
  }

  const list: Array<any> = [];
  const docs = snapshot.docs;

  // Neet to use for-of loop instead of `snapshot.forEach` for the async stuff to work D:
  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop/37576787#37576787
  for (const doc of docs) {
    const data = doc.data();
    const derefedData = { id: "" };

    // Check for nested refs ): This can't be right
    await Promise.all(
      Object.keys(data).map(async (key) => {
        const value = data[key];
        // TODO how do I check if some this is of type documentRef or collectionRef???
        if (typeof value === "object" && "get" in value) {
          // get the value of the rested reference
          const deref = await getDoc(value);
          derefedData[key] = deref;
        } else {
          derefedData[key] = value;
        }
      })
    );

    // need to add firestore ID because it doesn't come with `doc.data()`
    derefedData.id = doc.id;
    list.push(derefedData);
  }
  snapshot.forEach(async (doc) => {});

  return list;
}

function currentTime() {
  return firestore.Timestamp.fromDate(new Date());
}
