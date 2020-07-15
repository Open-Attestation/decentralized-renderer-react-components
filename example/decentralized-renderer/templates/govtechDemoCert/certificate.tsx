import React, { FunctionComponent } from "react";
import { certificateBg } from "./common/backgrounds";
import { TemplateProps } from "../../../../src";
import { OpencertsDocuments } from "../../../types";

export const DemoCert: FunctionComponent<TemplateProps<OpencertsDocuments>> = ({ document }) => (
  <div
    className="p-2 container"
    style={{
      backgroundImage: `url('${certificateBg}')`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      border: "10px solid #324353"
    }}
  >
    <div
      className="p-2"
      style={{
        border: "0px solid #324353"
      }}
    >
      <div className="mb-4 mb-lg-5 d-flex justify-content-center cert-body" style={{ textAlign: "center" }}>
        <i>This is to certify that</i>
      </div>
      <div className="mb-4 mb-lg-5 d-flex justify-content-center cert-title">
        <b>{document && document.recipient && document.recipient.name}</b>
      </div>
      <div className="mb-4 mb-lg-5 d-flex justify-content-center cert-body" style={{ textAlign: "center" }}>
        <i>has successfully completed the</i>
      </div>
      <div className="mb-4 mb-lg-5 d-flex justify-content-center cert-title" style={{ textAlign: "center" }}>
        OpenCerts Demo
      </div>
      <div className="mb-4 mb-lg-5 d-flex justify-content-center cert-body" style={{ textAlign: "center" }}>
        <i>certification through training administered by</i>
      </div>
      <div className="row">
        <div className="col" />
        <div className="col" />
      </div>

      <div
        className="row"
        style={{
          paddingLeft: "8%",
          paddingTop: "5%"
        }}
      >
        <div className="col text-center transcript">
          <img style={{ width: "100%", height: "auto" }} src={document.additionalData.certSignatories[0].signature} />
          <hr
            style={{
              border: "none",
              height: "1px",
              backgroundColor: "#333"
            }}
          />
          <div>
            <b>{document.additionalData.certSignatories[0].name}</b>
            <br />
            {document.additionalData.certSignatories[0].position},{" "}
            {document.additionalData.certSignatories[0].organisation}
          </div>
        </div>

        <div className="col" />

        <div
          className="d-flex flex-row-reverse col transcript"
          style={{
            paddingTop: "5%",
            paddingRight: "5%"
          }}
        >
          Dated {document.issuedOn}
        </div>
      </div>
    </div>
  </div>
);
