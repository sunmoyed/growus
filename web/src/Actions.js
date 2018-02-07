import React, { Component } from 'react';

class Actions extends Component {

  actions(links) {
    return links.map((alink, i) => {
      return (
        <button onClick={alink.handler} key={i}>
          {alink.title}
        </button>
      )
    })
  }

  render() {
    return (
      <div className="container actions">
        {this.actions(this.props.links)}
      </div>
    )
  }
}

export default Actions;
