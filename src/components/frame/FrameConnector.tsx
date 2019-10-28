import React, { CSSProperties, FunctionComponent, useEffect, useRef } from "react";
import { useChildFrame } from "./useFrame";
import { Document, SignedDocument } from "../../types";
import { HostActions, HostActionsHandler, LegacyHostActions } from "./host.actions";
import { FrameActions, LegacyFrameActions } from "./frame.actions";

interface BaseFrameConnectorProps {
  /**
   * URL of the content of the frame to render (URL to a decentralized renderer)
   */
  source: string;
  /**
   * Function called once the connection has been established with the frame. It provides another function to send actions to the frame.
   */
  onConnected: (toFrame: HostActionsHandler & LegacyHostActions) => void;
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
  dispatch: (action: FrameActions) => void;
  methods?: undefined;
}

interface LegacyFrameConnectorProps extends BaseFrameConnectorProps {
  /**
   * Functions that will listen for actions coming from the frame.
   */
  methods: LegacyFrameActions;
  dispatch?: undefined;
}

/**
 * Component creating a frame and establishing a connection with it.
 * Once the connection has been established, `onConnected` will be called and will provide, as first parameter, a function to send actions to the frame.
 * This component must be provided
 * - a `dispatch `function that will listen for actions coming from the frame
 * - the URL of the decentralized renderer to use as the `source` prop
 */
export const FrameConnector: FunctionComponent<FrameConnectorProps | LegacyFrameConnectorProps> = ({
  dispatch,
  methods,
  source,
  onConnected,
  style,
  className = ""
}) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore error because of typescript distributivity
  // FrameConnectorProps can me mapped to UseLegacyChildrenFrameProps which is not correct. It could be solved using
  // conditional but there is a hooks rules saying shouldn't use conditional
  const [connected, toFrame] = useChildFrame({ methods, dispatch, iframe });
  useEffect(() => {
    if (connected) {
      onConnected(
        Object.assign(
          (action: HostActions) => {
            if (toFrame.dispatch) {
              toFrame.dispatch(action);
            }
          },
          {
            renderDocument: (document: Document, rawDocument?: SignedDocument<Document>) => {
              if (toFrame.renderDocument) {
                toFrame.renderDocument(document, rawDocument);
              }
            },
            selectTemplateTab: (tabIndex: number) => {
              if (toFrame.selectTemplateTab) {
                toFrame.selectTemplateTab(tabIndex);
              }
            }
          }
        )
      );
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
