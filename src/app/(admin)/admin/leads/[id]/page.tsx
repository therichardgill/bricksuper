"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { cn, formatDate } from "@/lib/utils";

const pipelineStatuses = ["new", "contacted", "qualified", "converted", "lost"] as const;

const pipelineBadgeStyles: Record<string, string> = {
  new: "bg-gray-100 text-gray-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-gray-800 text-white",
  lost: "bg-red-100 text-red-800",
};

const tierBadgeStyles: Record<string, string> = {
  tier1: "bg-red-50 text-red-700",
  tier2: "bg-amber-50 text-amber-700",
  tier3: "bg-green-50 text-green-700",
};

export default function LeadDetailPage() {
  const { id } = useParams() as { id: string };
  const leadId = id as Id<"leads">;

  const data = useQuery(api.admin.getLead, { leadId });
  const updateStatus = useMutation(api.admin.updateLeadStatus);
  const addNote = useMutation(api.admin.addLeadNote);

  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (data === undefined) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Lead Detail</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 bg-white">
              <div className="h-6 w-40 bg-muted animate-pulse rounded mb-4" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-56 bg-muted animate-pulse rounded mb-3" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5 bg-white">
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-48 bg-muted animate-pulse rounded mb-3" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-bs-charcoal mb-6">Lead Detail</h1>
        <div className="border border-border rounded-xl p-5 bg-white">
          <p className="text-muted-foreground">Lead not found.</p>
        </div>
      </div>
    );
  }

  const { lead, partner, quizResponse, auditTrail, notes } = data;

  async function handleStatusChange(newStatus: typeof pipelineStatuses[number]) {
    await updateStatus({ leadId, newStatus, userId: "admin" });
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    setNoteError("");
    try {
      await addNote({ leadId, text: noteText.trim(), userId: "admin" });
      setNoteText("");
    } catch (err: unknown) {
      setNoteError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-bs-charcoal mb-6">
        {lead.firstName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <h2 className="font-semibold text-bs-charcoal mb-4">Contact Info</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="text-bs-charcoal font-medium">{lead.firstName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="text-bs-charcoal">{lead.email}</dd>
              </div>
              {lead.phone && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="text-bs-charcoal">{lead.phone}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Source</dt>
                <dd className="text-bs-charcoal">{lead.source}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tier</dt>
                <dd>
                  {lead.tier ? (
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        tierBadgeStyles[lead.tier] ?? "bg-gray-100 text-gray-800"
                      )}
                    >
                      {lead.tier}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-bs-charcoal">{formatDate(lead.createdAt)}</dd>
              </div>
              {partner && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Partner</dt>
                  <dd className="text-bs-charcoal">{partner.name}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Status action buttons */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <h2 className="font-semibold text-bs-charcoal mb-4">Pipeline Status</h2>
            <div className="flex flex-wrap gap-2">
              {pipelineStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
                    lead.pipelineStatus === status
                      ? "border-bs-charcoal bg-bs-charcoal text-white"
                      : "border-border bg-white text-bs-charcoal hover:bg-muted"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz answers */}
          {quizResponse && (
            <div className="border border-border rounded-xl p-5 bg-white">
              <h2 className="font-semibold text-bs-charcoal mb-4">Quiz Answers</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Score: {quizResponse.totalScore} | Tier: {quizResponse.tier} | Duration: {quizResponse.durationSeconds}s
              </p>
              <ul className="space-y-3">
                {quizResponse.answers.map((a, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-muted-foreground">{a.questionText}</p>
                    <p className="text-bs-charcoal font-medium">{a.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <h2 className="font-semibold text-bs-charcoal mb-4">Timeline</h2>
            {auditTrail.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
                <ul className="space-y-4">
                  {auditTrail.map((entry) => (
                    <li key={entry._id} className="relative">
                      <div className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-bs-charcoal border-2 border-white" />
                      <p className="text-sm text-bs-charcoal font-medium">{entry.action}</p>
                      {entry.details && (
                        <p className="text-xs text-muted-foreground">{entry.details}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(entry.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <h2 className="font-semibold text-bs-charcoal mb-4">Notes</h2>

            {notes.length > 0 && (
              <ul className="space-y-3 mb-4">
                {notes.map((note) => (
                  <li
                    key={note._id}
                    className="border-b border-border/50 pb-3 last:border-0"
                  >
                    <p className="text-sm text-bs-charcoal">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {note.userId} &middot; {formatDate(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-bs-charcoal/20"
              />
              {noteError && (
                <p className="text-xs text-red-600">{noteError}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !noteText.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-bs-charcoal text-white disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Note"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
