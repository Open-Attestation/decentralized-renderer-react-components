import React, { ReactElement } from "react";
import { RedactableValue } from "./RedactableValue";

export default {
  title: "RedactableValue/RedactableValue",
  component: RedactableValue,
};

export const RedactableValueDefault = (): ReactElement => {
  return <RedactableValue value="Some value" editable={false} onRedactionRequested={() => {}} />;
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
