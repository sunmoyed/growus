import React from "react";
import { firebaseAuth } from "./Auth";
import { User } from "firebase/app";

type Props = {
  user: User;
};

type State = {
  input: string;
};

export default class Home extends React.PureComponent<Props, State> {
  state = {
    input: ""
  };

  handleInputChange = input => {
    this.setState({ input });
  };

  render() {
    const { input } = this.state;
    const { user } = this.props;

    console.log(user);
    return (
      <div>
        <p>
          <img
            className="user-icon"
            src={user.photoURL || undefined}
            alt="user icon"
          />{" "}
          {user.displayName || "friend"} (
          <button
            className="link-button"
            onClick={e => {
              e.preventDefault();
              firebaseAuth().signOut();
            }}
          >
            logout
          </button>
          )
        </p>
        <p>you got this. \o/</p>
      </div>
    );
  }
}
