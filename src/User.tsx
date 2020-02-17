import React from "react";
// import { User } from "./types";

const UserBadge = ({
  displayName,
  imgSrc,
  username,
  size = 24,
  subtitle,
  verb = "did a",
  noun
}) => (
  <div
    className="user-badge"
    style={{
      gridGap: size * 0.3
    }}
  >
    <UserIcon
      displayName={displayName}
      imgSrc={imgSrc}
      size={size}
      username={username}
    />
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>
        <b>{displayName}</b>
        {noun && (
          <React.Fragment>
            {" "}
            <small>{verb}</small> {noun} ✨
          </React.Fragment>
        )}
      </span>
      {subtitle && <small>{subtitle}</small>}
    </div>
  </div>
);
export default UserBadge;

export const UserIcon = ({ displayName, imgSrc, size, username }) => (
  <img
    className="user-icon"
    src={imgSrc || ""}
    alt={`user icon ${username}`}
    title={`that's you, ${displayName}`}
    style={{ height: size, width: size }}
  />
);
