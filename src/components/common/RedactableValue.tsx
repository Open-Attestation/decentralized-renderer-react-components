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
  value?: string | number;
  onRedactionRequested?: () => void;
  editable?: boolean;
  iconRedact?: React.ReactElement;
  redactedMessage?: string;
  noValueMessage?: string;
}

/**
 * RedactableValue component is almost a duplicate of ObfuscatableValue component
 * ObfuscatableValue component started from OpenCerts, and may be in use on existing certificates, hence we do not want to meddle with the existing functionality
 * RedactableValue component displays a value and a cross when editable props is set to true, allows custom redact icon, hints at redacted values
 */
export const RedactableValue: FunctionComponent<RedactValueProps> = ({
  value,
  onRedactionRequested = noop,
  editable = false,
  iconRedact = <IconRedact />,
  redactedMessage,
  noValueMessage,
}) => {
  const [isRedacted, setRedacted] = useState(false);
  const DEFAULT_REDACTED_MSG = "**Redacted**";
  const DEFAULT_NO_VALUE_MSG = "**Field value does not exist**";

  if (isRedacted)
    return (
      <span style={{ display: "inline-block", color: "#454B50" }}>
        {redactedMessage ? redactedMessage : DEFAULT_REDACTED_MSG}
      </span>
    );
  if (!value)
    return (
      <span style={{ display: "inline-block", color: "#454B50" }}>
        {noValueMessage ? noValueMessage : DEFAULT_NO_VALUE_MSG}
      </span>
    );

  return (
    <>
      <span style={{ display: "inline-block", marginRight: "8px" }}>{value}</span>
      {editable && (
        <span
          title="Redact handler"
          style={{ display: "inline-block", cursor: "pointer" }}
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
