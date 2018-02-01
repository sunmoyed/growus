import React, { Component } from 'react';

class Checkbox extends Component {
  state = {
    isChecked: false,
  }

  // defining the function with fat arrow binds it here
  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState({isChecked: !this.state.isChecked});

    handleCheckboxChange(label, !this.state.isChecked);
  }

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
          <div><i className="checkmark">✔</i></div>
          <span className="label">
            {label}
          </span>
        </label>
      </div>
    );
  }
}

// Checkbox.propTypes = {
//   label: PropTypes.string.isRequired,
//   handleCheckboxChange: PropTypes.func.isRequired,
// };

export default Checkbox;
