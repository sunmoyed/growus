import React from "react";
// import { User } from "./types";

const UserBadge = ({ displayName, imgSrc, username, size = 24 }) => (
  <div
    style={{
      display: "inline-grid",
      gridTemplateColumns: "min-content auto",
      gridGap: size * 0.3
    }}
  >
    <UserIcon
      displayName={displayName}
      imgSrc={imgSrc}
      size={size}
      username={username}
    />
    <span>{displayName}</span>
  </div>
);
export default UserBadge;

const UserIcon = ({ displayName, imgSrc, size, username }) => (
  <img
    className="user-icon"
    src={imgSrc || ""}
    alt={`user icon ${username}`}
    title={`that's you, ${displayName}`}
    style={{ height: size, width: size }}
  />
);
