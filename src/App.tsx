import React from "react";
import Logo from "./Logo";

// base css library imported first
// https://github.com/kognise/water.css
import "./water-light.css";
// calendar styles
import "react-calendar/dist/Calendar.css";
// app styles
import "./App.css";
import Home from "./Home";
import Login from "./Login";
import history, { Link } from "./History";

import { User as FirebaseUser } from "firebase/app";

import { auth } from "./Auth";
import { getUser } from "./Database";
import { UserIcon } from "./User";

const EMPTY_USER = {
  username: "",
  displayName: "",
  imgSrc: ""
};

const Loading = () => {
  return null;
};

const CheckAuth = ({ user, ...props }) => {
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
  unregisterAuthObserver = () => {};
  unlisten = () => {};

  state = {
    pathname: history.location.pathname,
    page: getPage(history.location.pathname),
    user: undefined,
    userData: null
  };

  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(
      (user: FirebaseUser | null) => {
        this.handleUserUpdate(user);
      }
    );
    this.unlisten = history.listen(this.handleHistoryChange);
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
    this.unlisten();
  }

  handleHistoryChange = (location, action) => {
    this.setState({
      pathname: location.pathname,
      page: getPage(location.pathname || "/")
    });
  };

  handleUserUpdate = (user: FirebaseUser | null) => {
    this.setState({ user });
    this.fetchUserData(user);
  };

  fetchUserData = async appUser => {
    const userData = await getUser(appUser);
    this.setState({ userData });
  };

  render() {
    const { page, user, userData } = this.state;

    return (
      <div className="App">
        <header>
          <div className="container row-with-icon" style={{height: 30}}>
            <Link href="/" hideTextDecoration>
              <h1>
                let's grow us <Logo />
              </h1>
            </Link>
            <TitleIcon user={userData} />
          </div>
        </header>
        <div className="page">
          <div className="container">
            <CheckAuth
              user={user}
              onUserUpdate={this.handleUserUpdate}
              userData={userData}
              page={page}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

const TitleIcon = ({ user }) => {
  if (!user || !user.displayName) {
    return null;
  }
  return (
    <Link href={"profile"}>
      <UserIcon {...user} size={30} />
    </Link>
  );
};

function getPage(pathname): (pathname: string) => string {
  return pathname.split("/")[1];
}
