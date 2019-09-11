// https://github.com/Aaronius/penpal/releases/tag/v4.0.0 check TypeScript Declarations
declare module "penpal/lib/connectToParent" {
  interface ConnectToParentOptions {
    methods: {
      [key: string]: Function;
    };
  }
  interface ConnectToParentReturn {
    promise: Promise<{ [key: string]: Function }>;
  }
  export = (options: ConnectToParentOptions): ConnectToParentReturn => {};
}
declare module "penpal/lib/connectToChild" {
  interface ConnectToChildOptions {
    methods: {
      [key: string]: Function;
    };
    iframe: HTMLIFrameElement | null;
  }
  interface ConnectToChildReturn {
    promise: Promise<{ [key: string]: Function }>;
  }
  export = (options: ConnectToChildOptions): ConnectToChildReturn => {};
}
