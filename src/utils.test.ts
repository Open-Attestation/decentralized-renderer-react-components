import { repeat } from "./utils";

describe("repeat", () => {
  it("should not call callback when times is 0", () => {
    const callback = jest.fn();
    repeat(0)(callback);
    expect(callback).toHaveBeenCalledTimes(0);
  });
  it("should not call callback when times is 3", () => {
    const callback = jest.fn();
    repeat(3)(callback);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
