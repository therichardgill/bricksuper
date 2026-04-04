import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Process nurture email queue every hour
// Sends the next nurture email to leads who:
// - Captured email but did NOT opt in to specialist connection
// - Have not unsubscribed
// - Are due for their next nurture email based on nurtureStage + timing
crons.interval(
  "process nurture queue",
  { hours: 1 },
  internal.nurture.processNurtureQueue
);

export default crons;
