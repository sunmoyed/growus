import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import Login from "./Login";

import { User as FirebaseUser } from "firebase/app";

import { auth } from "./Auth";
import { getUser } from "./Database";

const EMPTY_USER = {
  username: "",
  displayName: "",
  imgSrc: ""
};

const Loading = () => {
  return <div>loading...</div>;
};

const Page = ({ user, ...props }) => {
  // auth state is loading, don't show anything
  if (user === undefined) {
    return <Loading />;
  } else if (!user) {
    return <Login {...props} />;
  }
  return (
    <Home user={user} userData={props.userData || EMPTY_USER} {...props} />
  );
};

class App extends React.Component {
  unregisterAuthObserver: undefined | (() => void);

  state = {
    user: undefined,
    userData: null
  };

  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(
      (user: FirebaseUser | null) => {
        this.handleUserUpdate(user);
      }
    );
  }

  componentWillUnmount() {
    !!this.unregisterAuthObserver && this.unregisterAuthObserver();
  }

  handleUserUpdate = (user: FirebaseUser | null) => {
    this.setState({ user });
    this.fetchUserData(user);
  };

  fetchUserData = async appUser => {
    const userData = await getUser(appUser);
    this.setState({ userData });
  };

  handleSignOut = e => {
    e.preventDefault();
    this.setState({ specialMessage: "bye" });
    auth.signOut();
  };

  render() {
    const { user, userData } = this.state;

    return (
      <div className="App">
        <header>
          <div className="container">
            <h2>
              let's grow us <img src={logo} className="App-logo" alt="logo" />
            </h2>
            <NavBar onSignOut={this.handleSignOut} user={userData} />
          </div>
        </header>
        <div className="page">
          <div className="container">
            <Page
              user={user}
              onUserUpdate={this.handleUserUpdate}
              userData={userData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

const NavBar = ({ onSignOut, user }) => {
  if (!user || !user.displayName) {
    return null;
  }
  return (
    <div>
      <img
        className="user-icon"
        src={user.imgSrc || ""}
        alt={`user icon ${user.displayName}`}
        title={`that's you, ${user.displayName}`}
      />{" "}
      {user.username || "friend"} (
      <button className="text-button" onClick={onSignOut}>
        logout
      </button>
      )
    </div>
  );
};
