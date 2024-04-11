import "@testing-library/jest-dom";

// Need to manually import as jsdom env does not include these
import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextDecoder, TextEncoder });
