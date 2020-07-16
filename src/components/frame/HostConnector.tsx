import { FrameActionsHandler } from "./frame.actions";
import React, { FunctionComponent, useEffect } from "react";
import { useParentFrame } from "./useFrame";
import { HostActions } from "./host.actions";

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
    dispatch
  });
  useEffect(() => {
    if (connected) {
      onConnected(action => {
        if (toHost.dispatch) {
          toHost.dispatch(action);
        }
      });
    }
  }, [connected, toHost, onConnected]);
  return <>{children}</>;
};
