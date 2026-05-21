import { NextResponse } from "next/server";

function pausedAuthResponse() {
  return NextResponse.json(
    {
      error: {
        code: "FEATURE_UNAVAILABLE",
        message: "Authentication is paused for the YachayBot v2 MVP.",
      },
    },
    { status: 503 },
  );
}

export function GET() {
  return pausedAuthResponse();
}

export function POST() {
  return pausedAuthResponse();
}
