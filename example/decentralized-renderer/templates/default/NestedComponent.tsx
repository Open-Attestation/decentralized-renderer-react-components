import React, { FunctionComponent, useState } from "react";

const KeyValueComponent = ({ label, value }: { label: string; value: any }): React.ReactElement => {
  const [show, setShow] = useState(true);
  const toggleShow = (): void => setShow(!show);
  return (
    <div
      key={label}
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#d5effc"
      }}
    >
      <div
        className={`p-4`}
        style={{ backgroundColor: "#d5effc" }}
        onClick={toggleShow}
        data-component-id="toggle-display"
      >
        {label}
      </div>
      <div className={`p-4 text-truncate ${show ? "" : "d-none"}`} data-component-id="displayed-value">
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        {NestedComponent({ children: value })}
      </div>
    </div>
  );
};

export const NestedComponent: FunctionComponent = ({ children }) => {
  if (children && typeof children !== "object") {
    return <span>children.toString()</span>;
  } else if (children) {
    const grandchildren = Object.keys(children).map(key =>
      KeyValueComponent({ label: key, value: (children as any)[key] })
    );
    return (
      <div
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#d5effc"
        }}
      >
        {grandchildren}
      </div>
    );
  }
  return null;
};
