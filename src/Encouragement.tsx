import React from "react";
import {
  createEncouragement,
  deleteEncouragement,
  getAllEncouragements
} from "./Database";
import { Encouragement as EncouragementType } from "./types";

const encouragements = [
  "You got this!!",
  "If you didn't get it this time, you'll get it next time!"
];

export const RandomEncouragement = () => {
  const randomEncouragement =
    encouragements[Math.floor(Math.random() * encouragements.length)];

  return <p className="encouragement">{randomEncouragement}</p>;
};

const Encouragement = ({ onDelete, text }) => {
  return (
    <div>
      <input style={{ marginBottom: "10px" }} type="text" defaultValue={text} />
      <button
        style={{ marginLeft: "5px" }}
        className="text-button"
        onClick={onDelete}
      >
        x
      </button>
    </div>
  );
};

type State = {
  // encouragements?: any;
  encouragements?: Array<EncouragementType> | [];
};

export class Encouragements extends React.PureComponent<{}, State> {
  state = { encouragements: [] };

  constructor(props) {
    super(props);
    this.fetchEncouragements();
  }

  fetchEncouragements = () => {
    getAllEncouragements(this.handleEncouragementsChange);
  };

  handleEncouragementsChange = encouragements => {
    this.setState({ encouragements });
  };

  render() {
    const { encouragements } = this.state;

    return (
      <div className="section">
        <h3>Encouragements</h3>{" "}
        <div
          style={{
            margin: "10px",
            borderLeft: "2px solid #ccc",
            paddingLeft: "10px"
          }}
        >
          {encouragements.length
            ? encouragements.map(({ id, text }) => (
                <Encouragement
                  text={text}
                  key={id}
                  onDelete={() => deleteEncouragement(id)}
                />
              ))
            : "(none yet)"}
        </div>
      </div>
    );
  }
}

export default Encouragements;

export class AddEncouragement extends React.PureComponent {
  newEncouragement = async event => {
    event.preventDefault();

    const form = new FormData(event.target);

    createEncouragement(form.get("encouragement"));

    // clear form after submit
    // TODO check if submit was successful D:
    event.target.reset();
  };

  render() {
    return (
      <form className="section" onSubmit={this.newEncouragement}>
        <label>
          Say something to your future self (and everyone else)
          <input
            type="text"
            name="encouragement"
            defaultValue={""}
            placeholder="you got this"
          />
        </label>

        <button type="submit">remember it</button>
      </form>
    );
  }
}
