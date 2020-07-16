import { RefObject, useEffect, useState } from "react";
import connectToParent from "penpal/lib/connectToParent";
import connectToChild from "penpal/lib/connectToChild";
import { FrameActionsHandler, LegacyFrameActions } from "./frame.actions";
import { HostActionsHandler, LegacyHostActions } from "./host.actions";
import { inIframe } from "../../utils";

type Status = "DISCONNECTED" | "CONNECTING" | "CONNECTED";

interface UseParentFrameProps {
  dispatch: HostActionsHandler;
}
export const useParentFrame = function({
  dispatch
}: UseParentFrameProps): [boolean, { dispatch: FrameActionsHandler }] {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  useEffect(() => {
    const run = async (): Promise<void> => {
      setParentFrameConnection(
        await connectToParent({
          methods: {
            dispatch: dispatch
          }
        }).promise
      );
      setStatus("CONNECTED");
    };
    if (inIframe() && status === "DISCONNECTED") {
      setStatus("CONNECTING");
      run();
    }
  }, [status, dispatch]);
  return [status === "CONNECTED", parentFrameConnection];
};

interface UseChildrenFrameProps {
  dispatch: FrameActionsHandler;
  methods: LegacyFrameActions;
  iframe: RefObject<HTMLIFrameElement>;
}
export const useChildFrame = function(
  props: UseChildrenFrameProps
): [boolean, { dispatch?: HostActionsHandler } & Partial<LegacyHostActions>] {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  useEffect(() => {
    const run = async (): Promise<void> => {
      setParentFrameConnection(
        await connectToChild({
          methods: {
            dispatch: props.dispatch,
            ...props.methods
          },
          iframe: props.iframe.current
        }).promise
      );
      setStatus("CONNECTED");
    };
    if (props.iframe.current && status === "DISCONNECTED") {
      setStatus("CONNECTING");
      run();
    }
  }, [status, props]);
  return [status === "CONNECTED", parentFrameConnection];
};
