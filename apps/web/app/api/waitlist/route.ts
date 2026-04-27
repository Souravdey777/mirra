import { NextResponse, type NextRequest } from "next/server";

import { createWaitlistSignup, isWaitlistConfigured, normalizeWaitlistEmail } from "@/lib/waitlist";

export const runtime = "nodejs";

const SUCCESS_MESSAGE = "You're in. Mirra will meet you in your own voice soon.";
const ERROR_MESSAGE = "We could not save that email yet. Please try again soon.";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Send a valid email address." }, { status: 400 });
  }

  const email = typeof payload === "object" && payload && "email" in payload ? payload.email : "";
  const normalizedEmail = typeof email === "string" ? normalizeWaitlistEmail(email) : null;

  if (!normalizedEmail) {
    return NextResponse.json({ message: "Send a valid email address." }, { status: 400 });
  }

  try {
    await createWaitlistSignup({
      email: normalizedEmail,
      referrer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent")
    });

    return NextResponse.json({ message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("Waitlist signup failed", error);

    return NextResponse.json(
      {
        message: isWaitlistConfigured() ? ERROR_MESSAGE : "The waitlist database is not configured yet."
      },
      { status: 503 }
    );
  }
}
