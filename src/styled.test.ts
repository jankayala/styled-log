import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { styled } from "@/styled";

describe("styled", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("color application", () => {
    it("should apply single color", () => {
      const result = styled.red("Hello");
      expect(result).toBe("\x1b[31mHello\x1b[39m");
    });

    it("should warn when multiple foreground colors are applied", () => {
      const result = styled.red.blue("Hello");
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe("bgColor application", () => {
    it("should apply single color", () => {
      const result = styled.bgRed("Hello");
      expect(result).toBe("\x1b[41mHello\x1b[49m");
    });

    it("should warn when multiple background colors are applied", () => {
      const result = styled.bgRed.bgBlue("Hello");
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe("modifier application", () => {
    it("should apply single modifier", () => {
      const result = styled.bold("Hello");
      expect(result).toBe("\x1b[1mHello\x1b[22m");
    });

    it("should NOT warn when multiple modifiers are applied", () => {
      const result = styled.bold.underline("Hello");
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
