import { RefObject, useCallback, useEffect, useState } from "react";
import connectToParent from "penpal/lib/connectToParent";
import connectToChild from "penpal/lib/connectToChild";
import { getLogger } from "../../logger";
import { Action } from "../../types";
const { trace } = getLogger("toFrame");

type Status = "DISCONNECTED" | "CONNECTING" | "CONNECTED";
interface UseFrameProps {
  dispatch: (action: Action) => void;
  iframe?: RefObject<HTMLIFrameElement>;
}
interface UseLegacyFrameProps {
  methods: { [key: string]: Function };
  iframe?: RefObject<HTMLIFrameElement>;
}
const isLegacyFrameProps = (props: any): props is UseLegacyFrameProps => {
  return props && props.methods !== undefined;
};

const buildUseFrame = (connect: typeof connectToChild | typeof connectToParent) => (
  props: UseFrameProps | UseLegacyFrameProps
): [boolean, (action: Action) => void] => {
  const [parentFrameConnection, setParentFrameConnection] = useState<any>();
  const [status, setStatus] = useState<Status>("DISCONNECTED");

  // actions sent to host
  let toFrame;
  if (isLegacyFrameProps(props)) {
    toFrame = parentFrameConnection;
  } else {
    toFrame = useCallback(
      (action: Action): void => {
        if (parentFrameConnection) {
          trace(`frame sending ${action.type} to host`);
          parentFrameConnection.dispatch(action);
        }
      },
      [parentFrameConnection]
    );
  }

  useEffect(() => {
    const run = async (): Promise<void> => {
      setParentFrameConnection(
        await connect({
          methods: isLegacyFrameProps(props)
            ? props.methods
            : {
                dispatch: props.dispatch
              },
          iframe: (props.iframe && props.iframe.current) || null
        }).promise
      );
      setStatus("CONNECTED");
    };
    if (((props.iframe && props.iframe.current) || !props.iframe) && status === "DISCONNECTED") {
      setStatus("CONNECTING");
      run();
    }
  }, [status, props]);
  return [status === "CONNECTED", toFrame];
};
export const useParentFrame = buildUseFrame(connectToParent);
export const useChildFrame = buildUseFrame(connectToChild);
