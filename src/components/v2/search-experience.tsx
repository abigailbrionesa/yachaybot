"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search, BarChart3, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SearchResponse, SearchResult } from "@/lib/v2-types";

const examples = [
  "Que recursos explican educacion intercultural bilingue?",
  "Where can I find public information about indigenous languages and education?",
  "Que fuente ayuda a revisar patrimonio cultural inmaterial?",
];

export function SearchExperience() {
  const locale = useLocale();
  const [query, setQuery] = useState(examples[0]);
  const [submittedQuery, setSubmittedQuery] = useState(examples[0]);
  const [search, setSearch] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathPrefix = `/${locale}`;

  useEffect(() => {
    let isActive = true;

    async function runSearch() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/v1/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: submittedQuery, limit: 5 }),
        });

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const payload = await response.json() as SearchResponse;
        if (isActive) {
          setSearch(payload);
        }
      } catch (searchError) {
        if (isActive) {
          setSearch(null);
          setError(searchError instanceof Error ? searchError.message : "Search request failed");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      isActive = false;
    };
  }, [submittedQuery]);

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
                {search ? (
                  <>
                    <Badge variant={search.answer.refused ? "destructive" : "secondary"}>{search.answer.evidenceStrength} evidence</Badge>
                    <Badge variant="outline">{search.answer.language}</Badge>
                  </>
                ) : null}
              </div>
              <CardDescription>
                {isLoading ? "Searching indexed sources..." : search ? `Query latency: ${search.latencyMs}ms. Retrieved chunks: ${search.retrievedChunkIds.join(", ") || "none"}.` : "No search response yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {isLoading ? <p className="text-sm text-muted-foreground">Loading source-grounded answer...</p> : null}
              {!isLoading && !error && search?.results.length === 0 ? (
                <p className="text-sm text-muted-foreground">No source passed the local retrieval threshold.</p>
              ) : null}
              {search ? <p className="text-base leading-7">{search.answer.answer}</p> : null}
              {search?.answer.citations.length ? (
                <div className="flex flex-wrap gap-2">
                  {search.answer.citations.map((citation) => (
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
              <Link href={`${pathPrefix}/sources`}><BookOpenCheck className="size-4" /> Sources</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${pathPrefix}/evals`}><BarChart3 className="size-4" /> Eval dashboard</Link>
            </Button>
          </div>
        </div>

        <SourceCards results={search?.results ?? []} evidenceStrength={search?.evidenceStrength ?? "pending"} isLoading={isLoading} />
      </div>
    </section>
  );
}

function SourceCards({ results, evidenceStrength, isLoading }: { results: SearchResult[]; evidenceStrength: string; isLoading: boolean }) {
  return (
    <aside className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Retrieved source cards</h2>
        <p className="text-sm text-muted-foreground">Evidence strength: {evidenceStrength}</p>
      </div>
      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">Loading source cards...</CardContent>
        </Card>
      ) : results.length === 0 ? (
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
            <a className="text-primary underline" href={result.sourceUrl} target="_blank" rel="noreferrer">
              Open source
            </a>
          </CardContent>
        </Card>
      ))}
    </aside>
  );
}
