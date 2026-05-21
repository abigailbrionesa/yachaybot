import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: {
        code: "FEATURE_UNAVAILABLE",
        message: "Credentials login is paused for the YachayBot v2 MVP.",
      },
    },
    { status: 503 },
  );
}
