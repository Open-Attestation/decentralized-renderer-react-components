import { RefObject, useEffect, useState } from "react";
import { connectToParent, connectToChild } from "penpal";
import connectToChildV4 from "penpal-v4/lib/connectToChild";
import { FrameActionsHandler, LegacyFrameActions } from "./frame.actions";
import { HostActionsHandler, LegacyHostActions } from "./host.actions";
import { inIframe } from "../../utils";
import { getLogger } from "../../logger";

const { trace } = getLogger("useFrame");

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
    if (inIframe() && status === "DISCONNECTED") {
      const parentV5 = connectToParent({
        methods: {
          dispatch: dispatch
        },
        timeout: 5000 // this will ensure connection to promise reject, when connection versions not match. otherwise it will be stucked in promise pending
      }).promise;

      setStatus("CONNECTING");

      parentV5
        .then(parentConnection => {
          trace("connectToParent success: ", parentConnection);
          setParentFrameConnection(parentConnection);
          setStatus("CONNECTED");
        })
        .catch(err => {
          trace("connectToParent failed: ", err);
          setStatus("DISCONNECTED");
        });
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
  const [childFrameConnection, setChildFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  useEffect(() => {
    if (props.iframe.current && status === "DISCONNECTED") {
      const childV5 = connectToChild({
        methods: {
          dispatch: props.dispatch,
          ...props.methods
        },
        iframe: props.iframe.current,
        timeout: 5000 // this will ensure connection to promise reject, when connection versions not match. otherwise it will be stucked in promise pending
      }).promise;

      const childV4 = connectToChildV4({
        methods: {
          dispatch: props.dispatch,
          ...props.methods
        },
        iframe: props.iframe.current,
        timeout: 5000 // this will ensure connection to promise reject, when connection versions not match. otherwise it will be stucked in promise pending
      }).promise;

      setStatus("CONNECTING");

      Promise.any([childV5, childV4])
        .then(childConnection => {
          trace("connectToChild success: ", childConnection);
          setChildFrameConnection(childConnection);
          setStatus("CONNECTED");
        })
        .catch(err => {
          trace("connectToChild failed: ", err);
          setStatus("DISCONNECTED");
        });
    }
  }, [status, props]);
  return [status === "CONNECTED", childFrameConnection];
};
