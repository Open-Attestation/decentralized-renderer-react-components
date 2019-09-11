import React, { FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface SimplePrivacyFilterBannerProps {
  /**
   * handler called when toggle edition is requested
   */
  onToggleEditable: () => void;
}

/**
 * Banner with icon to toggle certificate obfuscation mode
 */
export const SimplePrivacyFilterBanner: FunctionComponent<SimplePrivacyFilterBannerProps> = ({ onToggleEditable }) => (
  <div id="banner-privacy-filter" className="screen-only">
    <div
      className="row"
      css={{
        backgroundColor: "whitesmoke",
        padding: 20,
        marginBottom: 20
      }}
    >
      <div css={{ display: "inline-block" }}>
        <div className="h4">OpenCerts Privacy Filter Enabled</div>
        <div>
          Edit this certificate by removing sensitive information by clicking on the edit button. Downloaded certificate
          remains valid!
        </div>
      </div>
      <div className="ml-auto h5 pointer" css={{ display: "inline-block" }} onClick={onToggleEditable}>
        <FontAwesomeIcon icon={faEdit} title="toggle certificate obfuscation" css={{ cursor: "pointer" }} />
      </div>
    </div>
  </div>
);
