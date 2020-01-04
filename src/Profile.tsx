import React from "react";
import { auth, reauthenticate } from "./Auth";
import { User } from "./types";
import { User as FirebaseUser } from "firebase/app";
import { updateUser } from "./Database";

const ERR_RELOGIN = "auth/requires-recent-login";

export type ProfileProps = {
  user: User;
  onUserUpdate?: (user: FirebaseUser | null) => void;
  userData: User;
};

type State = {
  error: string;
};

const EMPTY_USER = {
  username: "",
  displayName: "",
  imgSrc: "",
  updated: null
};

export default class Profile extends React.PureComponent<ProfileProps, State> {
  state = {
    error: "",
    input: "",
    userData: {}
  };

  updateName = async e => {
    e.preventDefault();
    const { input } = this.state;
    const { onUserUpdate } = this.props;

    const appUser = auth.currentUser;

    if (appUser) {
      try {
        await appUser.updateProfile({ displayName: input });
        onUserUpdate && onUserUpdate(appUser);
        this.setState({ error: "" });
      } catch {
        this.setState({ error: "I didn't learn your name." });
      }
    }
  };

  updateAccount = async e => {
    e.preventDefault();
    const { onUserUpdate } = this.props;

    const appUser = auth.currentUser;
    const form = new FormData(e.target);
    const userData = {
      username: form.get("username"),
      displayName: form.get("displayName")
    };

    if (appUser) {
      updateUser(appUser.uid, userData);
      onUserUpdate && onUserUpdate(appUser);
    }
  };

  deleteAccount = async () => {
    if (
      !window.confirm(
        "do you want to delete your account? you won't be able to get it back."
      )
    ) {
      return;
    }
    const { onUserUpdate } = this.props;
    const appUser = auth.currentUser;

    if (appUser) {
      try {
        await appUser.delete();
        onUserUpdate && onUserUpdate(appUser);
      } catch (error) {
        if (error.code === ERR_RELOGIN) {
          // Prompt the user to re-provide their sign-in credentials
          await reauthenticate(appUser);
          this.deleteAccount();
        } else {
          this.setState({ error: error.message });
        }
      }
    }
  };

  handleSignOut = e => {
    e.preventDefault();
    auth.signOut();
  };

  render() {
    const { error } = this.state;
    const { userData = EMPTY_USER } = this.props;
    const updated =
      userData && userData.updated ? userData.updated.toDate() : null;

    return (
      <div className="section">
        <h3>Profile</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="section" onSubmit={this.updateAccount}>
          <label>
            What are you called?
            <input
              type="text"
              name="displayName"
              defaultValue={userData ? userData.displayName : ""}
            />
          </label>
          <label>
            username
            <input
              type="text"
              name="username"
              defaultValue={userData ? userData.username : ""}
            />
          </label>
          <button type="submit">that's me</button>
        </form>
        {updated && (
          <p>
            updated {updated.toDateString()} {updated.toLocaleTimeString()}
          </p>
        )}
        <p>
          <button className="text-button" onClick={this.handleSignOut}>
            logout
          </button>
        </p>
        <p>
          <button className="text-button" onClick={this.deleteAccount}>
            delete account
          </button>
        </p>
      </div>
    );
  }
}
