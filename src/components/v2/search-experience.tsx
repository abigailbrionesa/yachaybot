"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, BarChart3, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildAnswer, classifyEvidence, searchCorpus, type AnswerResult, type SearchResult } from "@/lib/v2-data";

const examples = [
  "Que recursos explican educacion intercultural bilingue?",
  "Where can I find public information about indigenous languages and education?",
  "Que fuente ayuda a revisar patrimonio cultural inmaterial?",
];

export function SearchExperience() {
  const [query, setQuery] = useState(examples[0]);
  const [submittedQuery, setSubmittedQuery] = useState(examples[0]);

  const search = useMemo(() => searchCorpus(submittedQuery, 5), [submittedQuery]);
  const answer: AnswerResult = useMemo(() => buildAnswer(submittedQuery, search.results), [submittedQuery, search.results]);
  const evidenceStrength = classifyEvidence(search.results);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
  }

  return (
    <section className="min-h-svh bg-background pt-24">
      <div className="container grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="outline">YachayBot v2 MVP</Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal md:text-5xl">
              Search Peruvian cultural and educational resources with visible evidence.
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Ask in Spanish or English. Quechua and Aymara behavior is experimental and source-bound until indexed evidence exists.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search sources"
              placeholder="Ask about EIB, public sources, heritage, language..."
              className="h-12"
            />
            <Button type="submit" className="h-12">
              <Search className="size-4" />
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <Button key={example} type="button" variant="outline" size="sm" onClick={() => {
                setQuery(example);
                setSubmittedQuery(example);
              }}>
                {example}
              </Button>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>Grounded answer</CardTitle>
                <Badge variant={answer.refused ? "destructive" : "secondary"}>{answer.evidenceStrength} evidence</Badge>
                <Badge variant="outline">{answer.language}</Badge>
              </div>
              <CardDescription>
                Query latency: {search.latencyMs}ms. Retrieved chunks: {search.results.map((result) => result.chunkId).join(", ") || "none"}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-7">{answer.answer}</p>
              {answer.citations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {answer.citations.map((citation) => (
                    <a key={citation.chunkId} href={`#${citation.chunkId}`}>
                      <Badge variant="outline">{citation.marker} {citation.title}</Badge>
                    </a>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/sources"><BookOpenCheck className="size-4" /> Sources</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/evals"><BarChart3 className="size-4" /> Eval dashboard</Link>
            </Button>
          </div>
        </div>

        <SourceCards results={search.results} evidenceStrength={evidenceStrength} />
      </div>
    </section>
  );
}

function SourceCards({ results, evidenceStrength }: { results: SearchResult[]; evidenceStrength: string }) {
  return (
    <aside className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Retrieved source cards</h2>
        <p className="text-sm text-muted-foreground">Evidence strength: {evidenceStrength}</p>
      </div>
      {results.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">No source passed the local retrieval threshold.</CardContent>
        </Card>
      ) : results.map((result) => (
        <Card key={result.chunkId} id={result.chunkId}>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              <Badge>{result.score.toFixed(2)}</Badge>
              <Badge variant="outline">{result.language}</Badge>
              <Badge variant={result.sourceType === "curated" ? "secondary" : "outline"}>{result.sourceType}</Badge>
            </div>
            <CardTitle className="leading-6">{result.title}</CardTitle>
            <CardDescription>{result.institution} · {result.region}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{result.snippet}</p>
            <p className="text-muted-foreground">{result.rightsNote}</p>
            <a className="text-primary underline" href={result.sourceUrl} target="_blank">
              Open source
            </a>
          </CardContent>
        </Card>
      ))}
    </aside>
  );
}
