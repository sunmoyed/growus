import React from "react";
import Profile, { ProfileProps } from "./Profile";
import Encouragement from "./Encouragement";

type Props = ProfileProps;

export default class Home extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <Encouragement />
        <Profile {...this.props} />
      </div>
    );
  }
}
