import React from "react";

const FC = ({ logSomething }) => (
  <div>
    I am a component
    <button onClick={logSomething}>Click me</button>
  </div>
);

export default FC;
