import React from "react";

export default class ColorPicker extends React.PureComponent<
  {
    color: string;
    colors: Array<string>;
    onColorClick: (color: string) => void;
    lineHeight?: number;
    size: number;
  },
  { editMode: boolean }
> {
  state = { editMode: false };
  static defaultProps = { size: 16 };

  toggleEditMode = () =>
    this.setState(prevState => {
      return { editMode: !prevState.editMode };
    });

  handleSquareClick = color => {
    this.props.onColorClick(color);
    this.toggleEditMode();
  };

  render() {
    const { color, colors, lineHeight, size } = this.props;
    const { editMode } = this.state;

    return (
      <div
        style={{
          position: "relative",
          height: `${lineHeight || size}px`,
          width: `${size}px`
        }}
      >
        <div
          style={{
            display: "inline-flex",
            position: "absolute",
            bottom: 0,
            gap: "6px"
          }}
        >
          <ColorSquare
            key={color}
            color={color}
            onColorClick={this.toggleEditMode}
            size={size}
          />
          {editMode && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {colors.map((color: string) => (
                <ColorSquare
                  key={color}
                  color={color}
                  onColorClick={this.handleSquareClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const ColorSquare = ({
  color,
  onColorClick = () => null,
  size = 16
}: {
  color: string;
  onColorClick?: (color: string) => void;
  size?: number;
}) => (
  <div
    style={{
      backgroundColor: `#${color}`,
      width: `${size}px`,
      height: `${size}px`,
      border: color === "ffffff" ? "1px solid #ccc" : "none",
      display: "inline-flex"
    }}
    onClick={() => onColorClick(color)}
  />
);
