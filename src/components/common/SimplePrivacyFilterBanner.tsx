import React, { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/core";

interface SimplePrivacyFilterBannerProps {
  /**
   * handler called when toggle edition is requested
   */
  onToggleEditable: () => void;
  className?: string;
}

const style = css`
  @media print {
    display: none;
  }
  background-color: whitesmoke;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  .icon {
    cursor: pointer;
  }
`;
/**
 * Banner with icon to toggle certificate obfuscation mode
 */
export const SimplePrivacyFilterBanner: FunctionComponent<SimplePrivacyFilterBannerProps> = ({
  onToggleEditable,
  className = ""
}) => (
  <div css={style} className={className}>
    <div className="text-container">
      <div>
        <h4>OpenCerts Privacy Filter Enabled</h4>
      </div>
      <div>
        Edit this certificate by removing sensitive information by clicking on the edit button. Downloaded certificate
        remains valid!
      </div>
    </div>
    <h5 className="icon" onClick={onToggleEditable}>
      <FontAwesomeIcon icon={faEdit} title="toggle certificate obfuscation" />
    </h5>
  </div>
);
