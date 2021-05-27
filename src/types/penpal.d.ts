/* eslint-disable */
// https://github.com/Aaronius/penpal/releases/tag/v4.0.0 check TypeScript Declarations
declare module "penpal-v4/lib/connectToParent" {
  interface ConnectToParentOptions {
    methods: {
      [key: string]: Function;
    };
    timeout: number;
  }
  interface ConnectToParentReturn {
    promise: Promise<{ [key: string]: Function }>;
  }
  export = (options: ConnectToParentOptions): ConnectToParentReturn => {};
}
declare module "penpal-v4/lib/connectToChild" {
  interface ConnectToChildOptions {
    methods: {
      [key: string]: Function;
    };
    iframe: HTMLIFrameElement | null;
    timeout: number;
  }
  interface ConnectToChildReturn {
    promise: Promise<{ [key: string]: Function }>;
  }
  export = (options: ConnectToChildOptions): ConnectToChildReturn => {};
}
