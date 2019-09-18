import React from "react";

const encouragements = [
  "You got this!!",
  "If you didn't get it this time, you'll get it next time!"
];

const Encouragement = () => {
  const randomEncouragement =
    encouragements[Math.floor(Math.random() * encouragements.length)];

  return <p className="encouragement">{randomEncouragement}</p>;
};

export default Encouragement;
