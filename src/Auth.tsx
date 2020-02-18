import React from "react";
import { FirebaseAuth } from "react-firebaseui";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// These values are unique, but not secrets.
// It's ok for them to be in the repo.
const firebaseConfig = {
  apiKey: "AIzaSyBxeS2P_8hW_RpNGhcAzq5kHhi3B6dVwM0",
  authDomain: "grow-us.firebaseapp.com",
  databaseURL: "https://grow-us.firebaseio.com",
  projectId: "grow-us",
  storageBucket: "",
  messagingSenderId: "614348119405",
  appId: "1:614348119405:web:392d641116df6d50cb4e64"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
const githubProvider = new firebase.auth.GithubAuthProvider();

export const reauthenticate = async user => {
  return user.reauthenticateWithPopup(githubProvider);
};

const uiConfigBase = {
  callbacks: {
    signInSuccessWithAuthResult: authResult => {
      console.log(authResult);
      return false;
    }
  },
  signInFlow: "popup",
  // Providers are configured on the firebase console:
  // https://console.firebase.google.com/u/0/project/grow-us/authentication/providers
  signInOptions: [
    // github application oauth settings:
    // https://github.com/organizations/sunmoyed/settings/applications/1136033
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ]
};

export const FirebaseLogin = ({ onSuccess }) => {
  const uiConfig = uiConfigBase;
  uiConfig.callbacks.signInSuccessWithAuthResult = onSuccess;

  return <FirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
};
