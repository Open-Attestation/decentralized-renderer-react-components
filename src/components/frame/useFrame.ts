import { RefObject, useEffect, useState } from "react";
import connectToParent from "penpal/lib/connectToParent";
import connectToChild from "penpal/lib/connectToChild";
import { FrameActionsHandler, LegacyFrameActions } from "./frame.actions";
import { HostActionsHandler, LegacyHostActions } from "./host.actions";

type Status = "DISCONNECTED" | "CONNECTING" | "CONNECTED";

interface UseParentFrameProps {
  dispatch: HostActionsHandler;
  methods?: LegacyHostActions;
}
export const useParentFrame = function(
  props: UseParentFrameProps
): [boolean, Partial<LegacyFrameActions> & { dispatch: FrameActionsHandler }] {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  useEffect(() => {
    const run = async (): Promise<void> => {
      setParentFrameConnection(
        await connectToParent({
          methods: {
            dispatch: props.dispatch,
            ...props.methods
          }
        }).promise
      );
      setStatus("CONNECTED");
    };
    if (status === "DISCONNECTED") {
      setStatus("CONNECTING");
      run();
    }
  }, [status, props]);
  return [status === "CONNECTED", parentFrameConnection];
};

interface UseLegacyChildrenFrameProps {
  dispatch?: undefined;
  methods: LegacyFrameActions;
  iframe: RefObject<HTMLIFrameElement>;
}
interface UseChildrenFrameProps {
  dispatch: FrameActionsHandler;
  methods?: undefined;
  iframe: RefObject<HTMLIFrameElement>;
}
export const useChildFrame = function(
  props: UseChildrenFrameProps | UseLegacyChildrenFrameProps
): [boolean, { dispatch?: HostActionsHandler } & Partial<LegacyHostActions>] {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  useEffect(() => {
    const run = async (): Promise<void> => {
      setParentFrameConnection(
        await connectToChild({
          methods: {
            ...(props.dispatch ? { dispatch: props.dispatch } : {}),
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
