import React, { useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "idk"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth;

export const uiConfigBase = {
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
  signInFlow: "popup",
  signInOptions: [firebaseAuth.GithubAuthProvider.PROVIDER_ID]
};
