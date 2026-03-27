import { describe, it, expect } from "vitest";
import {
  checkCompliance,
  assertCompliantText,
  isCompliant,
  BANNED_PHRASES,
} from "@/lib/compliance";

describe("compliance", () => {
  describe("checkCompliance", () => {
    it("returns empty array for clean text", () => {
      const result = checkCompliance(
        "BrickSuper provides educational information about SMSFs."
      );
      expect(result).toEqual([]);
    });

    it("detects each banned phrase", () => {
      for (const banned of BANNED_PHRASES) {
        const result = checkCompliance(
          `This text contains ${banned.phrase} which is banned.`
        );
        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result[0].phrase).toBe(banned.phrase);
      }
    });

    it("is case insensitive", () => {
      const result = checkCompliance("YOU SHOULD consider this.");
      expect(result.length).toBe(1);
      expect(result[0].phrase).toBe("you should");
    });

    it("detects multiple violations in one text", () => {
      const result = checkCompliance(
        "We recommend you should act now and get guaranteed high returns."
      );
      expect(result.length).toBeGreaterThanOrEqual(4);
    });

    it("includes position of violation", () => {
      const text = "Hello world you should do this.";
      const result = checkCompliance(text);
      expect(result[0].position).toBe(text.toLowerCase().indexOf("you should"));
    });

    it("includes legal basis for each violation", () => {
      const result = checkCompliance("This is independent advice.");
      expect(result[0].legalBasis).toContain("s923A");
    });

    it("passes text that uses safe alternatives", () => {
      const safeText =
        "BrickSuper provides educational and informational content. " +
        "Based on general industry benchmarks, your answers share characteristics " +
        "with situations where an SMSF may be worth investigating with a licensed specialist.";
      expect(checkCompliance(safeText)).toEqual([]);
    });

    it("catches partial phrase matches", () => {
      // "independent" appears within a sentence
      const result = checkCompliance(
        "We offer an independent review of your options."
      );
      expect(result.length).toBe(1);
    });
  });

  describe("assertCompliantText", () => {
    it("does not throw for compliant text", () => {
      expect(() =>
        assertCompliantText("Educational information about SMSF property.")
      ).not.toThrow();
    });

    it("throws for non-compliant text", () => {
      expect(() => assertCompliantText("We recommend this approach.")).toThrow(
        "Compliance violation"
      );
    });

    it("includes violation details in error message", () => {
      expect(() =>
        assertCompliantText("You should invest in this property.")
      ).toThrow("you should");
    });
  });

  describe("isCompliant", () => {
    it("returns true for clean text", () => {
      expect(isCompliant("Factual information about SMSFs.")).toBe(true);
    });

    it("returns false for text with banned phrases", () => {
      expect(isCompliant("We recommend this strategy.")).toBe(false);
    });
  });
});
