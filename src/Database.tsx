import { firebaseApp } from "./Auth";
import { firestore } from "firebase/app"; // types
import { User as FirebaseUser } from "firebase/app";
import { Encouragement, User } from "./types";

const EMPTY_USER = {
  username: "",
  displayName: "",
  imgSrc: ""
};

interface refsType {
  users: firestore.CollectionReference;
  encouragements: firestore.CollectionReference;
  user: firestore.DocumentReference | null;
}

export const db = firebaseApp.firestore();

let REFS: refsType = {
  users: db.collection("users"),
  encouragements: db.collection("encouragements"),

  user: null
};

let SNAPSHOTS: { encouragements: firestore.QuerySnapshot | null } = {
  encouragements: null
};

let watchersInitialised = false;

const initializeWatchers = (encouragementsRef, onEncouragementsChange) => {
  if (!watchersInitialised) {
    encouragementsRef.onSnapshot(snapshot => {
      onEncouragementsChange(snapshotToList(snapshot));
    });
    watchersInitialised = true;
  }
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
  const metadata: Encouragement = {
    text,
    editor: REFS.user,
    created: currentTime()
  };

  REFS.encouragements.add({ ...metadata });
  // note: add returns a ref that you can use:
  // const encouragementRef = await REFS.encouragements.add({ ...metadata });
}

export async function deleteEncouragement(id) {
  REFS.encouragements.doc(id).delete();
}

export async function getAllEncouragements(onEncouragementsChange) {
  const snapshot: firestore.QuerySnapshot = await REFS.encouragements.get();
  SNAPSHOTS.encouragements = snapshot;

  initializeWatchers(REFS.encouragements, onEncouragementsChange);

  const allEncouragements = snapshotToList(snapshot);
  return allEncouragements;

  // const encouragements: Encouragements = allEncouragements;
  // return encouragements;
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

function snapshotToList(snapshot: firestore.QuerySnapshot | null) {
  if (snapshot === null) {
    return;
  }

  const list: Array<any> = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    // need to add firestore ID because it doesn't come with the data
    data.id = doc.id;
    list.push(data);
  });
  return list;
}

function currentTime() {
  return new Date();
}
