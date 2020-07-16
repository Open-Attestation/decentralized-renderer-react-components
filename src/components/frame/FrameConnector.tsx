import React, { CSSProperties, FunctionComponent, useEffect, useMemo, useRef } from "react";
import { useChildFrame } from "./useFrame";
import { HostActions, HostActionsHandler, LegacyHostActions } from "./host.actions";
import { FrameActions, LegacyFrameActions, obfuscateField, updateHeight, updateTemplates } from "./frame.actions";
import { Template } from "../../types";

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
  // this is used to store internally the latest templates shared in order to automatically transform
  // the selected template tab from the label to th index in the event we communicate with a legacy renderer
  // - templates is used to store the latest templates received and we use a ref in order to avoid triggering effect change when templates. Triggering the effect would mean that the consumer would be called again with the `onConnected` callback, which could be weird
  // - dispatchProxy is used to listen for action and react accordingly (update templates)
  const templates = useRef<Template[]>([]);
  const dispatchProxy = useMemo(() => {
    return (action: FrameActions) => {
      if (action.type === "UPDATE_TEMPLATES") {
        templates.current = action.payload;
      }
      return dispatch(action);
    };
  }, [dispatch]);

  // map automatically legacy method to the dispatch object so that the consumer doesn't need to provide this
  // that way we handle automatically legacy renderer
  const methods = useMemo<LegacyFrameActions>(() => {
    return {
      updateHeight: (height: number) => dispatchProxy(updateHeight(height)),
      updateTemplates: templates => dispatchProxy(updateTemplates(templates)),
      handleObfuscation: field => dispatchProxy(obfuscateField(field))
    };
  }, [dispatchProxy]);

  const [connected, toFrame] = useChildFrame({ methods, dispatch: dispatchProxy, iframe });
  useEffect(() => {
    if (connected) {
      onConnected(
        Object.assign((action: HostActions) => {
          // if toFrame.dispatch is set that means we are on the main track with modern renderer
          // there is nothing to do but to call dispatch with the action provided.
          if (toFrame.dispatch) {
            toFrame.dispatch(action);
          } else {
            // otherwise if toFrame.dispatch is NOT set that means that we are dealing with a legacy renderer
            // in that event we will map each action to it's legacy renderer function
            // - "RENDER_DOCUMENT" must call toFrame.renderDocument
            // - "SELECT_TEMPLATE" must call toFrame.selectTemplateTab
            // - "PRINT" must call toFrame.print
            if (action.type === "RENDER_DOCUMENT" && toFrame.renderDocument) {
              toFrame.renderDocument(action.payload.document, action.payload.rawDocument);
            } else if (action.type === "SELECT_TEMPLATE" && toFrame.selectTemplateTab) {
              const index = templates.current.findIndex(template => template.id === action.payload);
              if (index === -1) console.error(`Unable to find the index associated with the label ${action.payload}`);
              toFrame.selectTemplateTab(index);
            } else if (action.type === "PRINT" && toFrame.print) {
              toFrame.print();
            }
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
