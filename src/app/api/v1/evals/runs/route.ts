import { NextResponse } from "next/server";
import { runEval } from "@/lib/v2-data";

export function GET() {
  const run = runEval();
  return NextResponse.json({ runs: [run] });
}

export function POST() {
  return NextResponse.json({ run: runEval() });
}
