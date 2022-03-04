import React, { ReactElement } from "react";
import { ObfuscatableValue } from "./ObfuscatableValue";

export default {
  title: "ObfuscatableValue/ObfuscatableValue",
  component: ObfuscatableValue,
};

export const ObfuscatableValueDefault = (): ReactElement => {
  return <ObfuscatableValue value="Some value" />;
};

export const ObfuscatableValueIconDefault = (): ReactElement => {
  return (
    <ObfuscatableValue value="Some value" editable onObfuscationRequested={() => console.log("Please obfuscate")} />
  );
};

export const ObfuscatableValueIconCustom = (): ReactElement => {
  return (
    <ObfuscatableValue
      value="Some value"
      editable
      onObfuscationRequested={() => console.log("Please obfuscate")}
      iconRedact={<>X</>}
    />
  );
};
