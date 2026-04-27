"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";

import { captureClientEvent, getClientDistinctId } from "@/lib/posthog-client";

const IDLE_MESSAGE = "Early access for solo creators. No auto-posting.";
const SUBMITTING_MESSAGE = "Saving your spot...";
const FALLBACK_ERROR_MESSAGE = "We could not save that email yet. Please try again soon.";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage(SUBMITTING_MESSAGE);
    captureClientEvent("waitlist_submit_attempt", {
      location: "landing_hero",
      source: "website"
    });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          distinctId: getClientDistinctId(),
          email
        })
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message ?? FALLBACK_ERROR_MESSAGE);
      }

      setStatus("success");
      setMessage(data?.message ?? "You're in. Mirra will meet you in your own voice soon.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE);
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="waitlist-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="waitlist-email">
        Email address
      </label>
      <input
        id="waitlist-email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        required
        placeholder="your@email.com"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join waitlist"}
        <ArrowRight aria-hidden size={18} strokeWidth={2.5} />
      </button>
      <p aria-live="polite" data-status={status}>
        {message}
      </p>
    </form>
  );
}
