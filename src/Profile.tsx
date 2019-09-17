import React from "react";
import { firebaseApp } from "./Auth";
import { User } from "./types";

export type ProfileProps = {
  user: User;
  onUserUpdate?: (user: User | null) => void;
};

type State = {
  error: string;
  input: string;
};

export default class Profile extends React.PureComponent<ProfileProps, State> {
  state = {
    error: "",
    input: ""
  };

  handleInputChange = e => {
    this.setState({ input: e.target.value.trim() });
  };

  updateName = async e => {
    e.preventDefault();
    const { input } = this.state;
    const { onUserUpdate } = this.props;

    const appUser = firebaseApp.auth().currentUser;

    if (appUser) {
      try {
        await appUser.updateProfile({ displayName: input });
        onUserUpdate && onUserUpdate(appUser);
        this.setState({ input: "", error: "" });
      } catch {
        this.setState({ error: "I didn't learn your name." });
      }
    }
  };

  render() {
    const { error, input } = this.state;

    return (
      <div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form>
          <label>
            What are you called?
            <input
              type="text"
              value={input}
              onChange={this.handleInputChange}
            />
          </label>
          <button type="submit" onClick={this.updateName}>
            that's me
          </button>
        </form>
      </div>
    );
  }
}
