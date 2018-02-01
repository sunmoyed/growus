import React, { Component } from 'react';

import Exercise from './Exercise'
import Checkbox from './Checkbox'

class Editor extends Component {

  constructor(props) {
    super()

    this.state = {
      items: []
    }
  }

  componentWillMount() {
    this.fetchExercises()
  }

  fetchExercises() {
    fetch('http://localhost:9001/exercises')
      .then(results => results.json())
      .then(jsonResponse => {
        this.setState({items: jsonResponse})
      })
  }

 createCheckbox(label, key) {
   return (
     <Checkbox
       label={label}
       handleCheckboxChange={this.toggleCheckbox}
       key={key}
       />
   )
 }

 toggleCheckbox = (label, isChecked) => {
 }

  render() {
    const { items } = this.state

    return (
      <div className="container editor items">
        <input type="text" placeholder="title"></input>
        <ul>
          {items.map((exercise, index) => this.createCheckbox(exercise, index))}
        </ul>
        <button>save workout</button>
      </div>
    );
  }
}

export default Editor;
