import React from "react";
import Profile, { ProfileProps } from "./Profile";
import Encouragements, {
  RandomEncouragement,
  AddEncouragement
} from "./Encouragement";
import Exercises from "./Exercises";
import Workouts from "./Workouts";

type Props = ProfileProps;
type State = {
  page: string;
};

export default class Home extends React.Component<Props, State> {
  state = {
    page: ""
  };

  componentDidMount() {
    const path = window.location.pathname;
    const state = { page: path };

    window.history.replaceState(state, path, path);
    this.setState(state);

    window.onpopstate = this.historyPopHandler;
  }

  componentWillUnmount() {
    window.onpopstate = null;
  }

  historyPopHandler = event => {
    const { state } = event;

    if (state) {
      this.setState(state);
    }
  };

  changePage = path => {
    window.history.pushState({ ...this.state, page: path }, path, path);
    this.setState({ page: path });
  };

  navigation = () => (
    <div className="list-row">
      <button
        className="text-button"
        onClick={() => this.changePage("/profile")}
      >
        profile
      </button>
      <button
        className="text-button"
        onClick={() => this.changePage("/encouragements")}
      >
        encouragements
      </button>
      <button
        className="text-button"
        onClick={() => this.changePage("/exercises")}
      >
        exercises
      </button>
      <button
        className="text-button"
        onClick={() => this.changePage("/workouts")}
      >
        workouts
      </button>
    </div>
  );

  render() {
    const { page } = this.state;
    const Navigation = this.navigation;

    switch (page) {
      case "/profile":
        return (
          <div>
            <Navigation />
            <RandomEncouragement />
            <Profile {...this.props} />
          </div>
        );
      case "/encouragements":
        return (
          <div>
            <Navigation />
            <RandomEncouragement />
            <Encouragements />
            <AddEncouragement />
          </div>
        );
      case "/exercises":
        return (
          <div>
            <Navigation />
            <RandomEncouragement />
            <Exercises />
          </div>
        );
      case "/workouts":
        return (
          <div>
            <Navigation />
            <Workouts />
          </div>
        );
      case "/":
      default:
        return (
          <div>
            <Navigation />
            <RandomEncouragement />
          </div>
        );
    }
  }
}
