import React, { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { noop } from "../../utils";

interface ObfuscatableValueProps {
  /**
   * value to be displayed
   */
  value?: string | number;
  /**
   * handler called when obfuscation is requested for the current value
   */
  onObfuscationRequested?: () => void;
  /**
   * indicates whether the value is editable or not
   */
  editable?: boolean;
}

/**
 * Component displaying a value and a cross when editable props is set to true
 * Consumer is notified thanks to obfuscate property that the value displayed must be obfuscated
 */
export const ObfuscatableValue: FunctionComponent<ObfuscatableValueProps> = ({
  value,
  onObfuscationRequested = noop,
  editable = false
}) =>
  value ? (
    <div
      onClick={() => {
        if (editable) {
          onObfuscationRequested();
        }
      }}
      style={{ display: "inline-block" }}
    >
      {value}{" "}
      {editable && (
        <FontAwesomeIcon title="Obfuscate value" icon={faTimes} style={{ color: "red", cursor: "pointer" }} />
      )}
    </div>
  ) : null;
