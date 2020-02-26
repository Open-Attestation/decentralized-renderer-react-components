import React, { Component } from "react";
import { transcriptBg } from "./common/backgrounds";
import { ObfuscatableValue } from "../../../../src/components/common/ObfuscatableValue";
import { Banner } from "./common/Banner";
import { TemplateProps } from "../../../../src/types";

export class DemoTranscript extends Component<TemplateProps<any>, { editable: boolean }> {
  constructor(props: TemplateProps<any>) {
    super(props);
    this.state = { editable: false };
  }

  render(): React.ReactElement {
    const { editable } = this.state;
    const { document, handleObfuscation } = this.props;
    const documentName = document.name;
    const documentId = document.id;
    const issuanceDate = document.issuedOn;
    const admissionDate = document.admissionDate;
    const graduationDate = document.graduationDate;

    const recipientName = document.recipient && document.recipient.name;
    const recipientNric = document.recipient && document.recipient.nric;
    const recipientCourse = document.recipient && document.recipient.course;
    const studentId = document.additionalData.studentId;

    const transcriptData = document.transcript || [];

    const transcriptSection = transcriptData.map((t: any, i: number) => (
      <tr key={i}>
        <td>
          <ObfuscatableValue
            editable={editable}
            value={t.courseCode}
            onObfuscationRequested={() => handleObfuscation(`transcript[${i}].courseCode`)}
          />
        </td>
        <td>
          <ObfuscatableValue
            editable={editable}
            value={t.name}
            onObfuscationRequested={() => handleObfuscation(`transcript[${i}].name`)}
          />
        </td>
        <td>
          <ObfuscatableValue
            editable={editable}
            value={t.grade}
            onObfuscationRequested={() => handleObfuscation(`transcript[${i}].grade`)}
          />
        </td>
        <td>
          <ObfuscatableValue
            editable={editable}
            value={t.courseCredit}
            onObfuscationRequested={() => handleObfuscation(`transcript[${i}].courseCredit`)}
          />
        </td>
        <td>
          <ObfuscatableValue
            editable={editable}
            value={t.semester}
            onObfuscationRequested={() => handleObfuscation(`transcript[${i}].semester`)}
          />
        </td>
      </tr>
    ));

    return (
      <div className="container">
        <Banner onToggleEditable={() => this.setState({ editable: !editable })} />
        <div
          className="p-2 container"
          style={{
            backgroundImage: `url('${transcriptBg}')`,
            backgroundRepeat: "repeat"
          }}
        >
          <div className="row root cert-title" style={{ paddingLeft: "3%" }}>
            <b>{documentName}</b>
          </div>

          <div
            className="row transcript"
            style={{
              paddingTop: "3%",
              paddingLeft: "2%"
            }}
          >
            <div className="col">
              <div className="row">
                <div className="col">NAME</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {recipientName}
                </div>
              </div>
              <div className="row">
                <div className="col">COURSE</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {recipientCourse}
                </div>
              </div>
              <div className="row">
                <div className="col">NRIC/FIN</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {recipientNric}
                </div>
              </div>
              <div className="row">
                <div className="col">STUDENT ID</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {studentId}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="row">
                <div className="col">DOCUMENT ID</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {documentId}
                </div>
              </div>
              <div className="row">
                <div className="col">DATE OF ISSUANCE</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {issuanceDate}
                </div>
              </div>
              <div className="row">
                <div className="col">DATE OF ADMISSION</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {admissionDate}
                </div>
              </div>
              <div className="row">
                <div className="col">DATE OF GRADUATION</div>
                <div className="col">
                  :&nbsp;&nbsp;
                  {graduationDate}
                </div>
              </div>
            </div>
          </div>

          {transcriptData !== [] && (
            <div className="row mb-4" style={{ paddingLeft: "3%", paddingTop: "5%" }}>
              <div className="root cert-title">
                <b>Transcript</b>
              </div>
              <table className="w-100 transcript">
                <tbody>
                  <tr>
                    <th>Course Code</th>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Units</th>
                    <th>Semester</th>
                  </tr>
                  {transcriptSection}
                </tbody>
              </table>
            </div>
          )}

          <div className="row">
            {/*<div className="col">*/}
            {/*  <img*/}
            {/*    className="w-100"*/}
            {/*    style={{*/}
            {/*      paddingTop: "40%",*/}
            {/*      paddingLeft: "3%",*/}
            {/*      width: "100%",*/}
            {/*      height: "auto"*/}
            {/*    }}*/}
            {/*    src={require("./common/GOVTECH_logo.png")}*/}
            {/*    alt="Govtech Logo"*/}
            {/*  />*/}
            {/*</div>*/}
            <div className="col" />
            <div
              className="col text-center"
              style={{
                paddingTop: "5%",
                paddingRight: "5%",
                width: "100%",
                height: "auto"
              }}
            >
              <img className="w-100" src={document.additionalData.certSignatories[0].signature} />
              <hr className="m-1" />
              <div className="transcript">
                <b>{document.additionalData.certSignatories[0].name}</b>
                <br />
                {document.additionalData.certSignatories[0].position},{" "}
                {document.additionalData.certSignatories[0].organisation}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
