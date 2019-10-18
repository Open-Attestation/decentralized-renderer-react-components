import React, { CSSProperties, FunctionComponent, useEffect, useRef } from "react";
import { useChildFrame } from "./useFrame";
import { Action } from "../../types";
import { HostActions } from "./host.actions";
import { SerializedStyles } from "@emotion/core";

interface BaseFrameConnectorProps {
  /**
   * URL of the content of the frame to render (URL to a decentralized renderer)
   */
  source: string;
  /**
   * Function called once the connection has been established with the frame. It provides another function to send actions to the frame.
   */
  onConnected: (toFrame: (action: HostActions) => void) => void;
  /**
   * style to apply to the frame using emotion css prop
   */
  className?: string;
  /**
   * style to apply to the frame
   */
  style?: CSSProperties;
}
interface FrameConnectorProps extends BaseFrameConnectorProps {
  /**
   * Function that will listen for actions coming from the frame.
   */
  dispatch: (action: Action) => void;
}

/**
 * Component creating a frame and establishing a connection with it.
 * Once the connection has been established, `onConnected` will be called and will provide, as first parameter, a function to send actions to the frame.
 * This component must be provided
 * - a `dispatch `function that will listen for actions coming from the frame
 * - the URL of the decentralized renderer to use as the `source` prop
 */
export const FrameConnector: FunctionComponent<FrameConnectorProps> = ({
  dispatch,
  source,
  onConnected,
  style,
  className = ""
}) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  const [connected, toFrame] = useChildFrame({ dispatch, iframe });
  useEffect(() => {
    if (connected) {
      onConnected(toFrame);
    }
  }, [connected, toFrame, onConnected]);
  return (
    <iframe
      title="Decentralised Rendered Certificate"
      id="iframe"
      ref={iframe}
      src={source}
      style={style}
      className={className}
    />
  );
};

interface LegacyFrameConnectorProps extends BaseFrameConnectorProps {
  /**
   * Objects containing function to communicate with host
   */
  methods: { [key: string]: Function };
}

/**
 * @deprecated use FrameConnector
 * @see FrameConnector
 * Using decentralized renderer legacy API to communicate through custom methods instead of unified dispatch interface
 */
export const LegacyFrameConnector: FunctionComponent<LegacyFrameConnectorProps> = ({
  methods,
  source,
  onConnected,
  style,
  className = ""
}) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  const [connected, toFrame] = useChildFrame({ methods, iframe });
  useEffect(() => {
    if (connected) {
      onConnected(toFrame);
    }
  }, [connected, toFrame, onConnected]);
  return (
    <iframe
      title="Decentralised Rendered Certificate"
      id="iframe"
      ref={iframe}
      src={source}
      style={style}
      className={className}
    />
  );
};
