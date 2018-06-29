import React, { Component } from 'react';

class Exercise extends Component {
  render() {
    return (
      <li className="exercise">
        {this.props.children}
      </li>
    );
  }
}

export default Exercise;
