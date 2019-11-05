import { HostActions } from "..";

declare global {
  interface Window {
    openAttestation: (action: HostActions) => void;
  }
}
