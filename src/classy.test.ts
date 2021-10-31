import { renderHook } from "@testing-library/react-hooks";
import { useClassy } from "./classy";

describe("classy", () => {
  describe("prop", () => {
    it("returns `prop` and `classy` functions correctly", () => {
      const props = {
        a: 1,
        b: 2,
        c: 3,
      };
      const { result } = renderHook(() => useClassy(props));

      expect(typeof result.current.prop).toBe("function");
      expect(typeof result.current.classy).toBe("function");
    });

    it("calculates single `prop` condition correctly", () => {
      const props = {
        a: 1,
        b: 2,
        c: 3,
      };
      const { result } = renderHook(() => useClassy(props));

      expect(result.current.prop({ a: 1, b: 2 })).toBe(true);
      expect(result.current.prop({ a: 2, b: 2 })).toBe(false);

      expect(result.current.prop({ b: [1, 2] })).toBe(true);
      expect(result.current.prop({ b: [1, 3] })).toBe(false);

      expect(result.current.prop({ c: 3 }));
    });

    it("calculates composite `prop` condition correctly", () => {
      const props = {
        a: 1,
        b: 2,
        c: 3,
      };
      const { result } = renderHook(() => useClassy(props));

      expect(result.current.prop([{ a: 1 }, { b: 1 }])).toBe(true);
      expect(result.current.prop([{ a: 1 }, { b: 1 }, { c: [1, 2, 3] }])).toBe(true);
    });

    it("calculates complex `prop` condition correctly", () => {
      const props = {
        a: 1,
        b: 2,
        c: 3,
      };
      const { result } = renderHook(() => useClassy(props));

      expect(result.current.prop([{ a: 1 }, { b: 1 }, { c: [1, 2, 3] }])).toBe(true);
    });
  });

  describe("classy", () => {
    it("returns correct classes based on primitive booleans", () => {
      const { result } = renderHook(() => useClassy({}));

      const a = result.current.classy({
        "class-a": true,
        "class-b": true,
        "class-c": true,
      });

      expect(a).toBe("class-a class-b class-c");

      expect(
        result.current.classy({
          "class-a": true,
          "class-b": false,
          "class-c": true,
        })
      ).toBe("class-a class-c");

      expect(
        result.current.classy({
          "class-a": true,
          "class-b": true,
          "class-c": false,
        })
      ).toBe("class-a class-b");

      expect(
        result.current.classy({
          "class-a": false,
          "class-b": false,
          "class-c": false,
        })
      ).toBe("");
    });

    it("returns correct classes based on `prop` helper return", () => {
      const props = {
        a: 1,
        b: 2,
        c: 3,
      };

      const { result } = renderHook(() => useClassy(props));
      const { prop, classy } = result.current;

      expect(
        classy({
          "class-a": prop({ a: 1 }),
          "class-b": prop({ b: 2 }),
          "class-c": prop({ c: 3 }),
        })
      ).toBe("class-a class-b class-c");

      expect(
        classy({
          "class-a": prop({ a: 1 }),
          "class-b": prop({ b: [1, 2, 3] }),
          "class-c": prop({ c: "any value" }),
        })
      ).toBe("class-a class-b");

      expect(
        classy({
          "class-a": prop({ a: false }),
          "class-b": prop({ b: [1, 2, 3] }),
          "class-c": prop([{ a: 1 }, { c: "any value" }]),
          "class-d": prop({ a: 1 }) && props.b === 2,
        })
      ).toBe("class-b class-c class-d");

      expect(
        classy(
          "class-0",
          {
            "class-a": prop({ a: false }),
            "class-b": prop({ b: [1, 2, 3] }),
            "class-c": prop([{ a: 1 }, { c: "any value" }]),
            "class-d": prop({ a: 1 }) && props.b === 2,
          },
          "class-n"
        )
      ).toBe("class-0 class-b class-c class-d class-n");
    });
  });
});
