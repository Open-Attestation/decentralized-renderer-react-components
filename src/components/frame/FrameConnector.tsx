import React, { CSSProperties, FunctionComponent, useEffect, useMemo, useRef } from "react";
import { useChildFrame } from "./useFrame";
import { HostActions, HostActionsHandler, LegacyHostActions } from "./host.actions";
import { FrameActions, LegacyFrameActions, obfuscateField, updateHeight, updateTemplates } from "./frame.actions";

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
   * style to apply to the frame
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

  const methods = useMemo<LegacyFrameActions>(() => {
    return {
      updateHeight: (height: number) => dispatch(updateHeight(height)),
      updateTemplates: templates => dispatch(updateTemplates(templates)),
      handleObfuscation: field => dispatch(obfuscateField(field))
    };
  }, [dispatch]);
  const [connected, toFrame] = useChildFrame({ methods, dispatch, iframe });
  useEffect(() => {
    if (connected) {
      onConnected(
        Object.assign((action: HostActions) => {
          if (toFrame.dispatch) {
            toFrame.dispatch(action);
          } else if (action.type === "RENDER_DOCUMENT" && toFrame.renderDocument) {
            toFrame.renderDocument(action.payload.document, action.payload.rawDocument);
          } else if (action.type === "SELECT_TEMPLATE" && toFrame.selectTemplateTab) {
            if (typeof action.payload === "number") {
              toFrame.selectTemplateTab(action.payload);
            } else if (action.meta.templates) {
              const index = action.meta.templates.findIndex(template => template.id === action.payload);
              toFrame.selectTemplateTab(index);
            } else {
              throw new Error(`Unable to handle ${action.type} when payload is a string`);
            }
          } else if (action.type === "PRINT" && toFrame.print) {
            toFrame.print();
          }
        })
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
      sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
    />
  );
};
