import { FrameActionsHandler } from "./frame.actions";
import React, { FunctionComponent, useEffect } from "react";
import { useParentFrame } from "./useFrame";
import { Document } from "../../types";
import { HostActions, renderDocument, selectTemplate, print } from "./host.actions";
import { WrappedDocument } from "@govtechsg/open-attestation";

interface HostConnectorProps {
  /**
   * Function that will listen for actions coming from the host.
   */
  dispatch: (action: HostActions) => void;
  /**
   * Function called once the connection has been established with the host. It provides another function to send actions to the host.
   */
  onConnected: (toHost: FrameActionsHandler) => void;
}

/**
 * Component connecting to the host of the frame.
 * Once the connection has been established, `onConnected` will be called and will provide, as first parameter, a function to send actions to the host.
 * This component must be provided a `dispatch `function that will listen for actions coming from the host.
 */
export const HostConnector: FunctionComponent<HostConnectorProps> = ({ dispatch, children, onConnected }) => {
  const [connected, toHost] = useParentFrame({
    dispatch,
    methods: {
      renderDocument: (document: Document, rawDocument?: WrappedDocument<Document>) => {
        dispatch(renderDocument({ document, rawDocument }));
      },
      selectTemplateTab: (tabIndex: number) => {
        dispatch(selectTemplate(tabIndex));
      },
      print: () => {
        dispatch(print());
      }
    }
  });
  useEffect(() => {
    if (connected) {
      onConnected(action => {
        if (toHost.dispatch) {
          toHost.dispatch(action);
        } else if (action.type === "UPDATE_HEIGHT" && toHost.updateHeight) {
          toHost.updateHeight(action.payload);
        } else if (action.type === "OBFUSCATE" && toHost.handleObfuscation) {
          toHost.handleObfuscation(action.payload);
        } else if (action.type === "UPDATE_TEMPLATES" && toHost.updateTemplates) {
          toHost.updateTemplates(action.payload);
        }
      });
    }
  }, [connected, toHost, onConnected]);
  return <>{children}</>;
};
