"use client";

import { ArrowRight, Check, X } from "lucide-react";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { captureClientEvent, getClientDistinctId } from "@/lib/posthog-client";

const IDLE_MESSAGE = "Early access for solo creators. No auto-posting.";
const SUBMITTING_MESSAGE = "Saving your spot...";
const FALLBACK_ERROR_MESSAGE = "We could not save that email yet. Please try again soon.";
const PROFILE_FALLBACK_ERROR_MESSAGE = "We could not save those profiles yet. Please try again soon.";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(IDLE_MESSAGE);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState("");
  const [xProfileUrl, setXProfileUrl] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileStatus, setProfileStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isProfileModalOpen) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      profileInputRef.current?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileModalOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isProfileModalOpen]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailToSubmit = email.trim();

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
          email: emailToSubmit
        })
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message ?? FALLBACK_ERROR_MESSAGE);
      }

      setStatus("success");
      setMessage(data?.message ?? "You're in. Mirra will meet you in your own voice soon.");
      setSubmittedEmail(emailToSubmit);
      setEmail("");
      setProfileStatus("idle");
      setProfileMessage("");
      setIsProfileModalOpen(true);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : FALLBACK_ERROR_MESSAGE);
    }
  }

  async function onProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!linkedinProfileUrl.trim() && !xProfileUrl.trim()) {
      setProfileStatus("error");
      setProfileMessage("Add at least one profile URL, or skip for now.");
      return;
    }

    setProfileStatus("submitting");
    setProfileMessage("Preparing your exclusive beta setup...");
    captureClientEvent("waitlist_profile_submit_attempt", {
      location: "post_signup_modal",
      hasLinkedinProfile: Boolean(linkedinProfileUrl.trim()),
      hasXProfile: Boolean(xProfileUrl.trim())
    });

    try {
      const response = await fetch("/api/waitlist", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          distinctId: getClientDistinctId(),
          email: submittedEmail,
          linkedinProfileUrl,
          xProfileUrl
        })
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message ?? PROFILE_FALLBACK_ERROR_MESSAGE);
      }

      setProfileStatus("success");
      setProfileMessage(data?.message ?? "Beautiful. Your exclusive beta setup will feel more like you.");
      setLinkedinProfileUrl("");
      setXProfileUrl("");
    } catch (error) {
      setProfileStatus("error");
      setProfileMessage(error instanceof Error ? error.message : PROFILE_FALLBACK_ERROR_MESSAGE);
    }
  }

  function closeProfileModal() {
    setIsProfileModalOpen(false);
  }

  function skipProfileStep() {
    captureClientEvent("waitlist_profile_modal_skip", {
      location: "post_signup_modal"
    });
    closeProfileModal();
  }

  function onModalBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeProfileModal();
    }
  }

  const isSubmitting = status === "submitting";
  const isProfileSubmitting = profileStatus === "submitting";

  return (
    <>
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
          {isSubmitting ? "Joining..." : "Get early access"}
          <ArrowRight aria-hidden size={18} strokeWidth={2.5} />
        </button>
        <p aria-live="polite" data-status={status}>
          {message}
        </p>
      </form>

      {isProfileModalOpen ? (
        <div className="waitlist-modal-backdrop" role="presentation" onMouseDown={onModalBackdropMouseDown}>
          <section
            aria-describedby="waitlist-profile-description"
            aria-labelledby="waitlist-profile-title"
            aria-modal="true"
            className="waitlist-modal"
            role="dialog"
          >
            {profileStatus === "success" ? (
              <div className="waitlist-modal-success">
                <div className="waitlist-modal-topline">
                  <span className="waitlist-modal-status">
                    <Check aria-hidden size={15} strokeWidth={3} />
                    Exclusive beta
                  </span>
                  <button
                    aria-label="Close profile setup"
                    className="waitlist-modal-close"
                    type="button"
                    onClick={closeProfileModal}
                  >
                    <X aria-hidden size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <h2 id="waitlist-profile-title">You&apos;re on the inside list.</h2>
                <p id="waitlist-profile-description">{profileMessage}</p>
                <button type="button" onClick={closeProfileModal}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="waitlist-modal-topline">
                  <span className="waitlist-modal-status">
                    <Check aria-hidden size={15} strokeWidth={3} />
                    Exclusive beta
                  </span>
                  <button
                    aria-label="Close profile setup"
                    className="waitlist-modal-close"
                    type="button"
                    onClick={closeProfileModal}
                  >
                    <X aria-hidden size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="waitlist-modal-heading">
                  <h2 id="waitlist-profile-title">Your beta seat is reserved.</h2>
                  <p id="waitlist-profile-description">
                    Add the public profiles you write from and Mirra will prepare a private voice memory before your
                    invite.
                  </p>
                </div>

                <form className="waitlist-profile-form" onSubmit={onProfileSubmit}>
                  <div className="waitlist-profile-group">
                    <p className="waitlist-profile-group-title">Your public creator profiles</p>
                    <div className="waitlist-profile-fields">
                      <label htmlFor="waitlist-linkedin-url">
                        LinkedIn profile
                        <input
                          id="waitlist-linkedin-url"
                          ref={profileInputRef}
                          value={linkedinProfileUrl}
                          onChange={(event) => setLinkedinProfileUrl(event.target.value)}
                          type="text"
                          inputMode="url"
                          placeholder="https://linkedin.com/in/yourname"
                          disabled={isProfileSubmitting}
                        />
                      </label>
                      <label htmlFor="waitlist-x-url">
                        X profile
                        <input
                          id="waitlist-x-url"
                          value={xProfileUrl}
                          onChange={(event) => setXProfileUrl(event.target.value)}
                          type="text"
                          inputMode="url"
                          placeholder="https://x.com/yourname"
                          disabled={isProfileSubmitting}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="waitlist-profile-actions">
                    <button type="submit" disabled={isProfileSubmitting}>
                      {isProfileSubmitting ? "Saving..." : "Prepare my beta"}
                    </button>
                    <button
                      className="waitlist-profile-skip"
                      type="button"
                      disabled={isProfileSubmitting}
                      onClick={skipProfileStep}
                    >
                      Skip for now
                    </button>
                  </div>

                  <p aria-live="polite" data-status={profileStatus}>
                    {profileMessage || "Optional, but this helps make your invite feel handcrafted."}
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
