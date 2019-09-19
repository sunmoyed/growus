import { firebaseApp } from "./Auth";
import { User as FirebaseUser } from "firebase/app";
import { User } from "./types";

const COLLECTION = {
  USERS: "users"
};

const EMPTY_USER = {
  username: "",
  displayName: "",
  imgSrc: ""
};

export const db = firebaseApp.firestore();
const usersRef = db.collection(COLLECTION.USERS);

export async function createUser(user: FirebaseUser) {
  const date = new Date();
  const accountInfo = {
    ...getProfileInfoFromProvider(user),
    createdTime: date.toString()
  };
  console.log(accountInfo);

  const userRef = await usersRef.doc(user.uid);
  userRef.set(accountInfo);
  return getDoc(userRef);
}

export async function updateUser(uid, data) {
  const date = new Date();
  const accountInfo = {
    ...data,
    updatedTime: date.toString()
  };
  const userRef = await usersRef.doc(uid);
  userRef.update(accountInfo);

  return getDoc(userRef);
}

export async function getUser(user: FirebaseUser) {
  if (!user) {
    return EMPTY_USER;
  }
  const userRef = await usersRef.doc(user.uid);
  return getDoc(userRef);
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
