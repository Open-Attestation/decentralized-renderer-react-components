import React from "react";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

const INDENT_PX = 40;
const MAX_STACK_COUNT = 10;
const MAX_CHARACTERS = 200;
const MAX_CHARACTERS_REVEAL_FIRST_N = 100;
const MAX_CHARACTERS_REVEAL_LAST_N = 100;

function JsonLine(key: string, val: any) {
  return (
    <div key={key}>
      <span style={{ color: "black", fontWeight: 700 }}>{key}: </span>
      <span style={{ color: "#057A55" }}>{val}</span>
    </div>
  );
}

function formatJson(variable: any, stackCount = 0, indent = 0, key = ""): EmotionJSX.Element | string {
  if (stackCount > MAX_STACK_COUNT) {
    /* nested 5 levels. stop showing */
    return "...";
  }

  if (typeof variable === "object" && variable !== null && !Array.isArray(variable)) {
    const jsonLines = [];
    for (const key of Object.keys(variable)) {
      if (Array.isArray(variable[key])) {
        /* Array items will be rendered differently, and alongside sibling attributes.
        KEY_TO_ARRAY_ITEM[0]: ...
        KEY_TO_ARRAY_ITEM[1]: ...
        SIBLING_ATTRIBUTE: ...

        indent = 0 to keep alignment with sibling attributes
        */
        jsonLines.push(formatJson(variable[key], stackCount + 1, 0, key));
      } else {
        /* if attribute is a nested object, display the key and indent.
        
        KEY_TO_NESTED_OBJ:
            ATTRIBUTE1: ...
            ATTRIBUTE2: ...
        */
        jsonLines.push(JsonLine(key, formatJson(variable[key], stackCount + 1, INDENT_PX)));
      }
    }
    return <div style={{ marginLeft: `${indent}px` }}>{jsonLines}</div>; // wrapping in div basically starts a new line
  }

  if (Array.isArray(variable)) {
    return (
      <div style={{ marginLeft: `${indent}px` }}>
        {/* if an attribute is an array, display elements as <KEY_NAME>[0]: <ATTRIBUTE_VAL> */}
        {variable.map((element, index) => JsonLine(`${key}[${index}]`, formatJson(element, stackCount + 1, INDENT_PX)))}
      </div> // wrapping in div basically starts a new line
    );
  }

  if (typeof variable === "string" && variable.length >= MAX_CHARACTERS) {
    return (
      variable.substring(0, MAX_CHARACTERS_REVEAL_FIRST_N) +
      "[...]" +
      variable.substring(variable.length - MAX_CHARACTERS_REVEAL_LAST_N)
    );
  }

  return String(variable);
}

export const JsonView: React.FunctionComponent<{ src: any }> = (props) => {
  return (
    <pre
      data-testid={"json-view"}
      style={{
        backgroundColor: "white",
        fontSize: "14px",
        lineHeight: "21px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
    >
      {formatJson(props.src)}
    </pre>
  );
};
