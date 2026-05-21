import { NextResponse } from "next/server";
import { runEval } from "@/lib/v2-data";

interface EvalRunRouteContext {
  params: Promise<{
    runId: string;
  }>;
}

export async function GET(_req: Request, { params }: EvalRunRouteContext) {
  const { runId } = await params;
  const run = runEval();

  if (runId !== run.id) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Eval run not found.",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ run });
}
