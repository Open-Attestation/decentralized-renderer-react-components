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
