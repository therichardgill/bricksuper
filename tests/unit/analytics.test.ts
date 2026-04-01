import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to test the module's behavior with different window states.
// Import after setting up mocks.

describe("analytics", () => {
  let analytics: typeof import("@/lib/analytics");

  beforeEach(async () => {
    // Reset module cache so each test gets a clean import
    vi.resetModules();

    // Set up window.dataLayer
    (globalThis as Record<string, unknown>).window = {
      ...globalThis.window,
      location: { search: "", pathname: "/" } as Location,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer = [];

    analytics = await import("@/lib/analytics");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("trackQuizStart", () => {
    it("pushes quiz_start event to dataLayer", () => {
      analytics.trackQuizStart();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl).toHaveLength(1);
      expect(dl[0]).toEqual({ event: "quiz_start" });
    });
  });

  describe("trackQuizComplete", () => {
    it("pushes quiz_complete with tier and balance", () => {
      analytics.trackQuizComplete("tier3", "over-500k");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0]).toEqual({
        event: "quiz_complete",
        quiz_tier: "tier3",
        fund_balance_range: "over-500k",
      });
    });

    it("handles undefined balance gracefully", () => {
      analytics.trackQuizComplete("tier2");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0].quiz_tier).toBe("tier2");
      expect(dl[0].fund_balance_range).toBeUndefined();
    });
  });

  describe("trackEmailCapture", () => {
    it("pushes email_capture with enhanced conversion data", () => {
      analytics.trackEmailCapture("tier3", "over-500k", "hashed@email", "evt-123");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0].event).toBe("email_capture");
      expect(dl[0].event_id).toBe("evt-123");
      expect(dl[0].enhanced_conversion_data).toEqual({ email: "hashed@email" });
    });

    it("skips enhanced conversion data when no email", () => {
      analytics.trackEmailCapture("tier2", "200k-300k");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0].enhanced_conversion_data).toBeUndefined();
    });
  });

  describe("trackSpecialistRequest", () => {
    it("includes conversion value for tier3", () => {
      analytics.trackSpecialistRequest("tier3", "over-500k", "evt-456");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0].conversion_value).toBe(300);
      expect(dl[0].conversion_currency).toBe("AUD");
    });

    it("includes zero value for tier1", () => {
      analytics.trackSpecialistRequest("tier1", "under-100k");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0].conversion_value).toBe(0);
    });
  });

  describe("trackCalculatorUse", () => {
    it("pushes calculator_use event", () => {
      analytics.trackCalculatorUse("lrba");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dl = (window as any).dataLayer;
      expect(dl[0]).toEqual({
        event: "calculator_use",
        calculator_name: "lrba",
      });
    });
  });

  describe("ad blocker resilience", () => {
    it("does not throw when dataLayer is undefined", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).dataLayer;
      expect(() => analytics.trackQuizStart()).not.toThrow();
    });
  });

  describe("generateEventId", () => {
    it("returns a string", () => {
      const id = analytics.generateEventId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("returns unique values", () => {
      const id1 = analytics.generateEventId();
      const id2 = analytics.generateEventId();
      expect(id1).not.toBe(id2);
    });
  });

  describe("debug mode", () => {
    it("logs to console when gtm_debug param is present", () => {
      // Set debug mode
      Object.defineProperty(window, "location", {
        value: { search: "?gtm_debug=1", pathname: "/" },
        writable: true,
      });

      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      analytics.trackQuizStart();
      expect(consoleSpy).toHaveBeenCalledWith(
        "[GTM Debug]",
        "quiz_start",
        expect.objectContaining({ event: "quiz_start" })
      );
    });
  });
});
