import { v2 } from "@tradetrust-tt/tradetrust";

// sample example should ideally be extracted from opencerts schema
export interface OpencertsDocuments extends v2.OpenAttestationDocument {
  additionalData: any;
  description: string;
  issuers: { name: string; certificateStore: string; url: string }[];
  recipient?: {
    name?: string;
    nric?: string;
    course?: string;
  };
  issuedOn?: string;
  name?: string;
  admissionDate?: string;
  graduationDate?: string;
  transcript?: Array<any>;
}
