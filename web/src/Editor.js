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

 toggleCheckbox(label) {

 }

  render() {
    const { items } = this.state

    return (
      <div className="items">
        <ul>
          {items.map((exercise, index) => this.createCheckbox(exercise, index))}
        </ul>
      </div>
    );
  }
}

export default Editor;
