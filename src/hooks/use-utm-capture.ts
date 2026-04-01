"use client";

import { useEffect, useCallback } from "react";

const UTM_STORAGE_KEY = "bricksuper_utm";

interface UTMParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
}

/**
 * Captures UTM parameters from the URL on first visit and stores
 * them in sessionStorage. Returns a function to retrieve the stored params
 * for passing to the lead mutation.
 *
 * Handles: missing params (empty object), incognito mode (no-op),
 * malformed URLs (ignores bad params), and multiple page navigations
 * (only captures once per session, first-touch attribution).
 */
export function useUTMCapture(): () => UTMParams {
  useEffect(() => {
    try {
      // Only capture on first page load (first-touch attribution)
      if (sessionStorage.getItem(UTM_STORAGE_KEY)) return;

      const params = new URLSearchParams(window.location.search);
      const utm: UTMParams = {};

      const source = params.get("utm_source");
      const medium = params.get("utm_medium");
      const campaign = params.get("utm_campaign");
      const content = params.get("utm_content");
      const term = params.get("utm_term");

      if (source) utm.utmSource = source;
      if (medium) utm.utmMedium = medium;
      if (campaign) utm.utmCampaign = campaign;
      if (content) utm.utmContent = content;
      if (term) utm.utmTerm = term;

      utm.landingPage = window.location.pathname;

      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } catch {
      // sessionStorage unavailable (incognito, storage full) — silently ignore
    }
  }, []);

  const getUTMParams = useCallback((): UTMParams => {
    try {
      const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  return getUTMParams;
}
