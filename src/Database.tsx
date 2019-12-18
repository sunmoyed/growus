import { firebaseApp } from "./Auth";
import { firestore } from "firebase/app"; // types
import { User as FirebaseUser } from "firebase/app";
import { EncouragementData, User, Exercise } from "./types";

const EMPTY_USER = {
  username: "",
  displayName: "",
  imgSrc: ""
};

interface refsType {
  users: firestore.CollectionReference;
  encouragements: firestore.CollectionReference;
  user: firestore.DocumentReference | null;
  exercises: firestore.CollectionReference;
}

export const db = firebaseApp.firestore();

let REFS: refsType = {
  users: db.collection("users"),
  encouragements: db.collection("encouragements"),
  exercises: db.collection("exercises"),

  user: null
};

export async function createUser(user: FirebaseUser) {
  const accountInfo = {
    ...getProfileInfoFromProvider(user),
    created: currentTime()
  };
  console.log(accountInfo);

  REFS.user = await REFS.users.doc(user.uid);
  REFS.user.set(accountInfo);
  return getDoc(REFS.user);
}

export async function updateUser(uid, data) {
  const accountInfo = {
    ...data,
    updated: currentTime()
  };

  const userRef = REFS.user || (await REFS.users.doc(uid));
  userRef.update(accountInfo);

  return getDoc(REFS.user);
}

export async function getUser(user: FirebaseUser) {
  if (!user) {
    return EMPTY_USER;
  }
  REFS.user = await REFS.users.doc(user.uid);
  return getDoc(REFS.user);
}

function getProfileInfoFromProvider(user: FirebaseUser | null): User {
  if (user) {
    return {
      username: user.email || "",
      displayName: user.displayName || "",
      imgSrc: user.photoURL || ""
    };
  }
  return EMPTY_USER;
}

export async function createEncouragement(text) {
  const data: EncouragementData = {
    text,
    editor: REFS.user,
    created: currentTime()
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

  REFS.encouragements.onSnapshot(snapshot => {
    snapshot.query
      .orderBy("text", "desc")
      .get()
      .then(result =>
        snapshotToList(result).then(list => {
          onEncouragementsChange(list);
        })
      );
  });
}

export async function watchExercises(onExercisesChange) {
  REFS.exercises.onSnapshot(snapshot => {
    snapshot.query
      .where("userid", "==", REFS && REFS.user ? REFS.user.id : "")
      .get()
      .then(result =>
        snapshotToList(result).then(list => {
          onExercisesChange(list);
        })
      );
  });
}

export async function createExercise(name, description) {
  const data: Exercise = {
    name: name,
    description: description,
    userid: REFS.user ? REFS.user.id : ""
  };
  REFS.exercises.add({ ...data });
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
      Object.keys(data).map(async key => {
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
  snapshot.forEach(async doc => {});

  return list;
}

function currentTime() {
  return firestore.Timestamp.fromDate(new Date());
}
