import React from "react";
import { firebaseAuth } from "./Auth";

const Home = ({ user }) => {
  console.log(user);
  return (
    <div>
      <h3>Home</h3>
      <p>hello {user.displayName || "friend"}, you got this.</p>
      <button onClick={() => firebaseAuth().signOut()}>Sign out</button>
    </div>
  );
};

export default Home;
