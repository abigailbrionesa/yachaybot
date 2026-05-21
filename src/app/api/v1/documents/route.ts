import { NextResponse } from "next/server";
import { documents, getChunksForDocument } from "@/lib/v2-data";

export function GET() {
  return NextResponse.json({
    documents: documents.map((document) => ({
      ...document,
      chunks: getChunksForDocument(document.id),
    })),
  });
}
