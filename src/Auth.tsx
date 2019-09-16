import React, { useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";

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
export const firebaseAuth = firebase.auth;

export const uiConfigBase = {
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
  signInFlow: "popup",
  signInOptions: [firebaseAuth.GithubAuthProvider.PROVIDER_ID]
};
