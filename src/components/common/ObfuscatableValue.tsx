import React, { FunctionComponent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import { noop } from "../../utils";

const IconRedactStyled = styled.span`
  transition: color 0.2s ease-out;
  color: #dc2626; // text-red-600 (tailwind)

  &:hover {
    color: #b91c1c; // text-red-700 (tailwind)
  }
`;

const IconRedact: FunctionComponent = () => {
  return (
    <IconRedactStyled>
      <FontAwesomeIcon title="Redact default icon" icon={faTimes} />
    </IconRedactStyled>
  );
};

export interface ObfuscatableValueProps {
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
  /**
   * UI icon for obfuscating
   */
  iconRedact?: React.ReactElement;
}

/**
 * Component displaying a value and a cross when editable props is set to true
 * Consumer is notified thanks to obfuscate property that the value displayed must be obfuscated
 */
export const ObfuscatableValue: FunctionComponent<ObfuscatableValueProps> = ({
  value,
  onObfuscationRequested = noop,
  editable = false,
  iconRedact = <IconRedact />,
}) => {
  const [isRedacted, setRedacted] = useState(false);

  if (isRedacted) return <span style={{ display: "inline-block", color: "#454B50" }}>**Redacted**</span>;
  if (!value) return <span style={{ display: "inline-block", color: "#454B50" }}>**Field value does not exists**</span>;

  return (
    <>
      <span style={{ display: "inline-block", marginRight: "8px" }}>{value}</span>
      {editable && (
        <span
          title="Redact handler"
          style={{ display: "inline-block", cursor: "pointer" }}
          onClick={() => {
            if (editable) {
              onObfuscationRequested();
              setRedacted(true);
            }
          }}
        >
          {iconRedact}
        </span>
      )}
    </>
  );
};
