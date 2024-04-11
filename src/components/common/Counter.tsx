import React, { useState } from "react";

// Component to demonstrate the usage of DomListener in storybook
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Click on the buttons or resize the window and look at the actions triggered!</h3>
      <button onClick={() => setCount((prevCount) => prevCount - 1)}>-</button>
      <span> {count} </span>
      <button onClick={() => setCount((prevCount) => prevCount + 1)}>+</button>
    </div>
  );
};

// Component to demonstrate the usage of nested DomListener in storybook
export const CounterContext = React.createContext({
  count: 0,
  setCount: {},
});

const NestedCounter: React.FC<any> = ({ children }) => {
  const [count, setCount] = useState(0);

  const contextValue = {
    count,
    setCount,
  };

  return (
    <div>
      <h3>Resize the window and look at the actions triggered! Nothing is happening when clicking on buttons</h3>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span> {count} </span>
      <CounterContext.Provider value={contextValue}>{children}</CounterContext.Provider>
    </div>
  );
};
export { Counter, NestedCounter };
