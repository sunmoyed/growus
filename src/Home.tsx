import React from "react";
import { firebaseAuth } from "./Auth";

const Home = ({ user }) => {
  console.log(user);
  return (
    <div>
      <p>
        {user.displayName || "friend"} (
        <button
          className="link-button"
          onClick={e => {
            e.preventDefault();
            firebaseAuth().signOut();
          }}
        >
          logout
        </button>
        )
      </p>
      <p>you got this. \o/</p>
    </div>
  );
};

export default Home;
