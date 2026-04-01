/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";

// Mock sessionStorage
const mockStorage: Record<string, string> = {};
const mockSessionStorage = {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStorage[key];
  }),
};

describe("useUTMCapture", () => {
  beforeEach(() => {
    vi.resetModules();
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("captures UTM params from URL", async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: "?utm_source=google&utm_medium=cpc&utm_campaign=smsf&utm_term=smsf+property",
        pathname: "/smsf-quiz",
      },
      writable: true,
    });

    const { useUTMCapture } = await import("@/hooks/use-utm-capture");
    const { result } = renderHook(() => useUTMCapture());

    const params = result.current();
    expect(params.utmSource).toBe("google");
    expect(params.utmMedium).toBe("cpc");
    expect(params.utmCampaign).toBe("smsf");
    expect(params.utmTerm).toBe("smsf property");
    expect(params.landingPage).toBe("/smsf-quiz");
  });

  it("returns empty object when no UTM params", async () => {
    Object.defineProperty(window, "location", {
      value: { search: "", pathname: "/" },
      writable: true,
    });

    const { useUTMCapture } = await import("@/hooks/use-utm-capture");
    const { result } = renderHook(() => useUTMCapture());

    const params = result.current();
    expect(params.utmSource).toBeUndefined();
    expect(params.utmMedium).toBeUndefined();
  });

  it("returns stored params on subsequent calls (first-touch)", async () => {
    // Pre-populate storage as if a prior page captured UTMs
    mockStorage["bricksuper_utm"] = JSON.stringify({
      utmSource: "google",
      utmMedium: "cpc",
    });

    Object.defineProperty(window, "location", {
      value: { search: "?utm_source=meta", pathname: "/quiz" },
      writable: true,
    });

    const { useUTMCapture } = await import("@/hooks/use-utm-capture");
    const { result } = renderHook(() => useUTMCapture());

    const params = result.current();
    // Should return the STORED params (first-touch), not the new URL params
    expect(params.utmSource).toBe("google");
  });

  it("handles sessionStorage errors gracefully", async () => {
    // Simulate incognito mode
    Object.defineProperty(window, "sessionStorage", {
      get: () => {
        throw new Error("SecurityError");
      },
    });

    Object.defineProperty(window, "location", {
      value: { search: "?utm_source=google", pathname: "/" },
      writable: true,
    });

    const { useUTMCapture } = await import("@/hooks/use-utm-capture");
    const { result } = renderHook(() => useUTMCapture());

    // Should not throw, returns empty object
    expect(() => result.current()).not.toThrow();
    expect(result.current()).toEqual({});
  });
});
