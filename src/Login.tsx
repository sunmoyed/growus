import React from "react";
import { FirebaseAuth } from "react-firebaseui";
import { firebaseApp, uiConfigBase } from "./Auth";

const uiConfig = uiConfigBase;
uiConfig.callbacks.signInSuccessWithAuthResult = () => {
  console.log("signed in");
  return false;
};

class Login extends React.PureComponent {
  render() {
    return (
      <div>
        <h3>Log in</h3>
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />
      </div>
    );
  }
}

export default Login;
