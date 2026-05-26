import { NextResponse } from "next/server";
import { searchWithAdapter } from "@/lib/v2-search-adapter";
import { searchRequestSchema, validationError } from "@/lib/v2-schemas";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = searchRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(validationError("Search request is invalid", parsed.error.flatten()), { status: 400 });
  }

  const { query, limit = 5 } = parsed.data;
  return NextResponse.json(await searchWithAdapter(query, limit));
}
