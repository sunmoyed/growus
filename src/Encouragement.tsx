import React from "react";
import {
  createEncouragement,
  deleteEncouragement,
  watchEncouragements
} from "./Database";
import UserBadge from "./User";
import {
  Encouragement as EncouragementType,
  EncouragementData as EncouragementDataType
} from "./types";


export class RandomEncouragement extends React.PureComponent<{}, {encouragements: Array<EncouragementType>}> {
  state = {
     encouragements: [],
  }

  constructor(props) {
    super(props);
    watchEncouragements(this.updateEncouragements)
    
  }

  updateEncouragements = (newEncouragements: Array<EncouragementType>) => {
    this.setState({ encouragements: newEncouragements });
  }

  render() {
    const {encouragements} = this.state
    
    const randomEncouragement: EncouragementType =
    encouragements[Math.floor(Math.random() * encouragements.length)];

    if (!randomEncouragement) {
      return null
    } else {
      return (<p className="encouragement">{randomEncouragement.editor.displayName}: {randomEncouragement.text}</p>);
    }
  }
};

type EncouragementProps = EncouragementDataType & { onDelete?: () => void };

class Encouragement extends React.PureComponent<EncouragementProps, {}> {
  render() {
    const { editor, onDelete, text } = this.props;

    return (
      <div
        className="section"
        style={{
          borderLeft: "2px solid #ccc",
          paddingLeft: "10px"
        }}
      >
        <div className="encouragement-row">
          <span>{text}</span>
          {onDelete && (
            <button className="text-button" onClick={onDelete}>
              x
            </button>
          )}
        </div>
        <UserBadge {...editor} size={18} />
      </div>
    );
  }
}

type State = {
  encouragements: Array<EncouragementType>;
};

export class Encouragements extends React.PureComponent<{}, State> {
  state = { encouragements: [] };

  constructor(props) {
    super(props);
    watchEncouragements(this.handleEncouragementsChange);
  }

  handleEncouragementsChange = (encouragements: Array<EncouragementType>) => {
    this.setState({ encouragements });
  };

  render() {
    const { encouragements }: State = this.state;

    return (
      <div className="section">
        <h3>Encouragements</h3>{" "}
        {encouragements.length
          ? encouragements.map(({ created, editor, id, text }) => {
              return (
                <Encouragement
                  key={`${id}-${editor}`}
                  created={created}
                  editor={editor}
                  onDelete={() => deleteEncouragement(id)}
                  text={text}
                />
              );
            })
          : null}
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
