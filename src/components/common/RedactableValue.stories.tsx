import React, { ReactElement } from "react";
import { RedactableValue } from "./RedactableValue";

export default {
  title: "Values/Redactable Value",
  component: RedactableValue,
};

export const RedactableValueDefault = (): ReactElement => {
  return (
    <RedactableValue
      value="Some value"
      editable={false}
      onRedactionRequested={() => {
        console.log("Please redact");
      }}
    />
  );
};

export const RedactableValueIconDefault = (): ReactElement => {
  return <RedactableValue value="Some value" editable onRedactionRequested={() => console.log("Please redact")} />;
};

export const RedactableValueIconCustom = (): ReactElement => {
  return (
    <RedactableValue
      value="Some value"
      editable
      onRedactionRequested={() => console.log("Please redact")}
      iconRedact={<>X</>}
    />
  );
};
