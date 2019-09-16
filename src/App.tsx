import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import Login from "./Login";

import { firebaseApp } from "./Auth";

const Page = ({ user }) => {
  if (!user) {
    return <Login />;
  }
  return <Home user={user} />;
};

class App extends React.Component {
  unregisterAuthObserver: undefined | (() => void);

  state = {
    user: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged(user => {
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
        <div className="container">
          <Page user={user} />
        </div>
      </div>
    );
  }
}

export default App;
