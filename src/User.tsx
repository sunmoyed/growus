import React from "react";
import { Link } from "./History";

// import { User } from "./types";

const UserBadge = ({
  displayName,
  imgSrc,
  username,
  size = 24,
  subtitle,
  verb = "did a",
  noun
}) => {
  const profileUrl = `/profile/${username}`;
  return (
    <div
      className="user-badge"
      style={{
        gridGap: size * 0.3
      }}
    >
      <Link href={profileUrl} inline>
        <UserIcon
          displayName={displayName}
          imgSrc={imgSrc}
          size={size}
          username={username}
        />
      </Link>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>
          <Link href={profileUrl} hideTextDecoration inline>
            <b>{displayName}</b>
          </Link>
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
};
export default UserBadge;

export const UserIcon = ({ displayName, imgSrc, size, username }) => (
  <img
    className="user-icon"
    src={imgSrc || ""}
    alt={`user icon ${username}`}
    title={`that's you, ${displayName || username}`}
    style={{ height: size, width: size }}
  />
);
