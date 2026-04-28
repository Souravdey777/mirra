import { NextResponse, type NextRequest } from "next/server";

import { captureServerEvent } from "@/lib/posthog-server";
import {
  createWaitlistSignup,
  isWaitlistConfigured,
  normalizeWaitlistEmail,
  normalizeWaitlistProfileUrl,
  updateWaitlistProfile
} from "@/lib/waitlist";

export const runtime = "nodejs";

const SUCCESS_MESSAGE = "You're in. Mirra will meet you in your own voice soon.";
const PROFILE_SUCCESS_MESSAGE = "Beautiful. Your exclusive beta setup will feel more like you.";
const ERROR_MESSAGE = "We could not save that email yet. Please try again soon.";
const PROFILE_ERROR_MESSAGE = "We could not save those profiles yet. Please try again soon.";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Send a valid email address." }, { status: 400 });
  }

  const email = typeof payload === "object" && payload && "email" in payload ? payload.email : "";
  const distinctId = typeof payload === "object" && payload && "distinctId" in payload ? payload.distinctId : null;
  const normalizedEmail = typeof email === "string" ? normalizeWaitlistEmail(email) : null;
  const normalizedDistinctId = typeof distinctId === "string" ? distinctId : null;

  if (!normalizedEmail) {
    return NextResponse.json({ message: "Send a valid email address." }, { status: 400 });
  }

  try {
    const signup = await createWaitlistSignup({
      email: normalizedEmail,
      referrer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent")
    });
    await captureServerEvent({
      distinctId: normalizedDistinctId,
      event: "waitlist_signup_success",
      properties: {
        duplicate: !signup.inserted,
        source: "website"
      }
    });

    return NextResponse.json({ message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Waitlist signup failed", error);
    await captureServerEvent({
      distinctId: normalizedDistinctId,
      event: "waitlist_signup_error",
      properties: {
        configured: isWaitlistConfigured(),
        errorType: error instanceof Error ? error.name : "unknown",
        source: "website"
      }
    });

    return NextResponse.json(
      {
        message: isWaitlistConfigured() ? ERROR_MESSAGE : "The waitlist database is not configured yet."
      },
      { status: 503 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Send valid profile URLs." }, { status: 400 });
  }

  const email = typeof payload === "object" && payload && "email" in payload ? payload.email : "";
  const distinctId = typeof payload === "object" && payload && "distinctId" in payload ? payload.distinctId : null;
  const linkedinProfileUrl =
    typeof payload === "object" && payload && "linkedinProfileUrl" in payload ? payload.linkedinProfileUrl : "";
  const xProfileUrl = typeof payload === "object" && payload && "xProfileUrl" in payload ? payload.xProfileUrl : "";
  const normalizedEmail = typeof email === "string" ? normalizeWaitlistEmail(email) : null;
  const normalizedDistinctId = typeof distinctId === "string" ? distinctId : null;
  const normalizedLinkedinProfileUrl =
    typeof linkedinProfileUrl === "string" && linkedinProfileUrl.trim()
      ? normalizeWaitlistProfileUrl(linkedinProfileUrl, "linkedin")
      : null;
  const normalizedXProfileUrl =
    typeof xProfileUrl === "string" && xProfileUrl.trim() ? normalizeWaitlistProfileUrl(xProfileUrl, "x") : null;

  if (!normalizedEmail) {
    return NextResponse.json({ message: "Join the beta list with your email first." }, { status: 400 });
  }

  if (typeof linkedinProfileUrl === "string" && linkedinProfileUrl.trim() && !normalizedLinkedinProfileUrl) {
    return NextResponse.json({ message: "Use a valid LinkedIn profile URL." }, { status: 400 });
  }

  if (typeof xProfileUrl === "string" && xProfileUrl.trim() && !normalizedXProfileUrl) {
    return NextResponse.json({ message: "Use a valid X profile URL." }, { status: 400 });
  }

  if (!normalizedLinkedinProfileUrl && !normalizedXProfileUrl) {
    return NextResponse.json({ message: "Add a valid LinkedIn or X profile URL." }, { status: 400 });
  }

  try {
    const signup = await updateWaitlistProfile({
      email: normalizedEmail,
      linkedinProfileUrl: normalizedLinkedinProfileUrl,
      xProfileUrl: normalizedXProfileUrl
    });

    if (!signup.updated) {
      return NextResponse.json({ message: "Join the beta list with your email first." }, { status: 404 });
    }

    await captureServerEvent({
      distinctId: normalizedDistinctId,
      event: "waitlist_profile_added",
      properties: {
        hasLinkedinProfile: Boolean(normalizedLinkedinProfileUrl),
        hasXProfile: Boolean(normalizedXProfileUrl),
        source: "website"
      }
    });

    return NextResponse.json({ message: PROFILE_SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Waitlist profile update failed", error);
    await captureServerEvent({
      distinctId: normalizedDistinctId,
      event: "waitlist_profile_error",
      properties: {
        configured: isWaitlistConfigured(),
        errorType: error instanceof Error ? error.name : "unknown",
        source: "website"
      }
    });

    return NextResponse.json(
      {
        message: isWaitlistConfigured() ? PROFILE_ERROR_MESSAGE : "The waitlist database is not configured yet."
      },
      { status: 503 }
    );
  }
}
