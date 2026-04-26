"use client";

import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

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
      />
      <button type="submit">
        Join waitlist
        <ArrowRight aria-hidden size={18} strokeWidth={2.5} />
      </button>
      <p aria-live="polite">
        {submitted ? "You're in. Mirra will meet you in your own voice soon." : "Early access for solo creators. No auto-posting."}
      </p>
    </form>
  );
}
