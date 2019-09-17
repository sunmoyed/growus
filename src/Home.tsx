import React from "react";
import Profile, { ProfileProps } from "./Profile";

type Props = ProfileProps;

export default class Home extends React.PureComponent<Props> {
  render() {
    return <Profile {...this.props} />;
  }
}
