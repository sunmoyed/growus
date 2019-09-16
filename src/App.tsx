import React from "react";
import logo from "./logo.svg";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <div className="container">
          <h2>
            let's grow us <img src={logo} className="App-logo" alt="logo" />
          </h2>
        </div>
      </header>
    </div>
  );
};

export default App;
