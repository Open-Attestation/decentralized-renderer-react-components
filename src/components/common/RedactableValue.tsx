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

export interface RedactValueProps {
  value?: string | number | Record<string, unknown> | Record<string, unknown>[];
  isValueHidden?: boolean;
  onRedactionRequested: () => void;
  editable: boolean;
  iconRedact?: React.ReactElement;
  redactedMessage?: string;
  noValueMessage?: string;
  className?: string;
}

export const DEFAULT_REDACTED_MSG = "**Redacted**";
export const DEFAULT_NO_VALUE_MSG = "**Field value does not exist**";

/**
 * RedactableValue component is almost a duplicate of ObfuscatableValue component
 * ObfuscatableValue component started from OpenCerts, and may be in use on existing certificates, hence we do not want to meddle with the existing functionality
 */
export const RedactableValue: FunctionComponent<RedactValueProps> = ({
  value,
  isValueHidden = false,
  onRedactionRequested = noop,
  editable = false,
  iconRedact = <IconRedact />,
  redactedMessage,
  noValueMessage,
  className = "",
}) => {
  const [isRedacted, setRedacted] = useState(false);

  const getMessage = () => {
    switch (true) {
      case isRedacted:
        return redactedMessage ? redactedMessage : DEFAULT_REDACTED_MSG;
      case !value:
        return noValueMessage ? noValueMessage : DEFAULT_NO_VALUE_MSG;
      case typeof value === "object":
        return <span>{JSON.stringify(value)}</span>;
      default:
        return value;
    }
  };

  return (
    <>
      {!isValueHidden && (
        <span className={`inline-block text-[#454B50]`} data-testid="redactable-value">
          {getMessage()}
        </span>
      )}
      {editable && value && (
        <span
          title="Redact handler"
          className={`inline-block cursor-pointer ${className}`}
          onClick={() => {
            if (editable) {
              onRedactionRequested();
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
