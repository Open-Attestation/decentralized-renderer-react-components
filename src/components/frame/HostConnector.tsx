import { FrameActions } from "./frame.actions";
import React, { FunctionComponent, useEffect } from "react";
import { useParentFrame } from "./useFrame";
import { Action } from "../../types";

interface HostConnectorProps {
  /**
   * Function that will listen for actions coming from the host.
   */
  dispatch: (action: Action) => void;
  /**
   * Function called once the connection has been established with the host. It provides another function to send actions to the host.
   */
  onConnected: (toHost: (action: FrameActions) => void) => void;
}

/**
 * Component connecting to the host of the frame.
 * Once the connection has been established, `onConnected` will be called and will provide, as first parameter, a function to send actions to the host.
 * This component must be provided a `dispatch `function that will listen for actions coming from the host.
 */
export const HostConnector: FunctionComponent<HostConnectorProps> = ({ dispatch, children, onConnected }) => {
  const [connected, toHost] = useParentFrame({ dispatch });
  useEffect(() => {
    if (connected) {
      onConnected(toHost);
    }
  }, [connected, toHost, onConnected]);
  return <>{children}</>;
};

interface LegacyHostConnectorProps {
  /**
   * Objects containing function to communicate with host
   */
  methods: { [key: string]: Function };
  /**
   * Function called once the connection has been established with the host. It provides another function to send actions to the host.
   */
  onConnected: (toHost: (action: FrameActions) => void) => void;
}
/**
 * @deprecated use HostConnector
 * @see HostConnector
 * Using decentralized renderer legacy API to communicate through custom methods instead of unified dispatch interface
 */
export const LegacyHostConnector: FunctionComponent<LegacyHostConnectorProps> = ({
  methods,
  children,
  onConnected
}) => {
  const [connected, toHost] = useParentFrame({ methods });
  useEffect(() => {
    if (connected) {
      onConnected(toHost);
    }
  }, [connected, toHost, onConnected]);
  return <>{children}</>;
};
