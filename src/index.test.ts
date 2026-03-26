import { describe, it, expect } from "vitest";
import * as index from "@/index";

describe("index re-exports", () => {
  it("exports logger", () => {
    expect(index.logger).toBeDefined();
  });
  it("exports styles", () => {
    expect(index.styled).toBeDefined();
  });
  it("exports VERSION", () => {
    expect(index.VERSION).toBe("1.0.0");
  });
});
