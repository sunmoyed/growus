import React from "react";
import { FirebaseLogin } from "./Auth";
import { createUser } from "./Database";

class Login extends React.PureComponent {
  handleLoginSuccess = async result => {
    if (result.additionalUserInfo.isNewUser) {
      const user = await createUser(result.user);
      console.log("new user created", user);
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <p>Which person are you?</p>
        <FirebaseLogin onSuccess={this.handleLoginSuccess} />
      </React.Fragment>
    );
  }
}

export default Login;
