import { RefObject, useCallback, useEffect, useState } from "react";
import connectToParent from "penpal/lib/connectToParent";
import connectToChild from "penpal/lib/connectToChild";
import { getLogger } from "../../logger";
import { Action } from "../../types";
const { trace } = getLogger("toFrame");

type Status = "DISCONNECTED" | "CONNECTING" | "CONNECTED";

const buildUseFrame = (connect: typeof connectToChild | typeof connectToParent) => (
  dispatch: (action: Action) => void,
  iframe?: RefObject<HTMLIFrameElement>
): [boolean, (action: Action) => void] => {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  // actions sent to host
  const toFrame = useCallback(
    (action: Action): void => {
      if (parentFrameConnection) {
        trace(`frame sending ${action.type} to host`);
        parentFrameConnection.dispatch(action);
      }
    },
    [parentFrameConnection]
  );

  useEffect(() => {
    const run = async (): Promise<void> => {
      setParentFrameConnection(
        await connect({
          methods: {
            dispatch
          },
          iframe: (iframe && iframe.current) || null
        }).promise
      );
      setStatus("CONNECTED");
    };
    if (((iframe && iframe.current) || !iframe) && status === "DISCONNECTED") {
      setStatus("CONNECTING");
      run();
    }
  }, [dispatch, status, iframe]);
  return [status === "CONNECTED", toFrame];
};
export const useParentFrame = buildUseFrame(connectToParent);
export const useChildFrame = buildUseFrame(connectToChild);
