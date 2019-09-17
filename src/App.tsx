import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import Login from "./Login";

import { User as FirebaseUser } from "firebase/app";

import { firebaseApp, firebaseAuth } from "./Auth";

function processUser(user) {
  if (!user) {
    return {};
  }
  return {
    name: user.displayName,
    photoURL: user.photoURL
  };
}

const Page = ({ user, ...props }) => {
  // auth state is loading, don't show anything
  if (user === undefined) {
    return <div />;
  } else if (!user) {
    return <Login {...props} />;
  }
  return <Home user={processUser(user)} {...props} />;
};

class App extends React.Component {
  unregisterAuthObserver: undefined | (() => void);

  state = {
    user: undefined
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged((user: FirebaseUser | null) => {
        this.setState({ user });
      });
  }

  componentWillUnmount() {
    !!this.unregisterAuthObserver && this.unregisterAuthObserver();
  }

  handleUserUpdate = (user: FirebaseUser) => {
    this.setState({ user });
  };

  handleSignOut = e => {
    e.preventDefault();
    firebaseAuth().signOut();
  };

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <header>
          <div className="container">
            <h2>
              let's grow us <img src={logo} className="App-logo" alt="logo" />
            </h2>
            <NavBar onSignOut={this.handleSignOut} user={processUser(user)} />
          </div>
        </header>
        <div className="page">
          <div className="container">
            <Page user={user} onUserUpdate={this.handleUserUpdate} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

const NavBar = ({ onSignOut, user }) => {
  if (!user || !user.photoURL || !user.name) {
    return null;
  }
  return (
    <div>
      <img
        className="user-icon"
        src={user.photoURL || undefined}
        alt={`user icon ${user.name}`}
        title={`that's you, ${user.name}`}
      />{" "}
      {user.name || "friend"} (
      <button className="link-button" onClick={onSignOut}>
        logout
      </button>
      )
    </div>
  );
};
