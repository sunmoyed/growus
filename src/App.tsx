import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import Login from "./Login";

import { User } from "firebase/app";

import { firebaseApp } from "./Auth";

const Page = ({ user }) => {
  console.log(user);

  // auth state is loading, don't show anything
  if (user === undefined) {
    return <div />;
  } else if (!user) {
    return <Login />;
  }
  return <Home user={user} />;
};

class App extends React.Component {
  unregisterAuthObserver: undefined | (() => void);

  state = {
    user: undefined
  };

  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged((user: User | null) => {
        console.log("auth state change", user && user.email);

        this.setState({ user });
      });
  }

  componentWillUnmount() {
    !!this.unregisterAuthObserver && this.unregisterAuthObserver();
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <header>
          <div className="container">
            <h2>
              let's grow us <img src={logo} className="App-logo" alt="logo" />
            </h2>
          </div>
        </header>
        <div className="page">
          <div className="container">
            <Page user={user} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
