import React from "react";
import Profile, { ProfileProps } from "./Profile";
import Encouragements, {
  RandomEncouragement,
  AddEncouragement
} from "./Encouragement";

type Props = ProfileProps;

export default class Home extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <RandomEncouragement />
        <Profile {...this.props} />
        <Encouragements />
        <AddEncouragement />
      </div>
    );
  }
}
