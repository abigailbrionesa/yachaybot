import { NextResponse } from "next/server";
import { runEval } from "@/lib/v2-data";

export function GET() {
  return NextResponse.json({ run: runEval() });
}
