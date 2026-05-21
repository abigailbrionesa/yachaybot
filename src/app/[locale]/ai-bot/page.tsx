"use client";

import { FormEvent, useState } from "react";
import { BookOpenCheck, Send } from "lucide-react";
import { Navbar } from "@/components/global/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AnswerResult, SearchResult } from "@/lib/v2-types";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  answer?: AnswerResult;
  results?: SearchResult[];
  modelUsed?: string;
};

const examples = [
  "Que recursos explican educacion intercultural bilingue?",
  "Where can I find public information about indigenous languages and education?",
  "Que fuente ayuda a revisar patrimonio cultural inmaterial?",
];

export default function AiBotPage() {
  const [input, setInput] = useState(examples[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role, content: message.content })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Chat request failed");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.answer.answer,
          answer: payload.answer,
          results: payload.results,
          modelUsed: payload.modelUsed,
        },
      ]);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Chat request failed");
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuestion(input);
  }

  return (
    <>
      <Navbar />
      <main className="container min-h-svh space-y-8 pt-28 pb-16">
        <section className="max-w-3xl space-y-3">
          <Badge variant="outline">Evidence-first chat</Badge>
          <h1 className="text-4xl font-bold tracking-normal">Ask conversationally, verify with sources.</h1>
          <p className="text-muted-foreground">
            This chat uses the same v2 retrieval, citation, and refusal rules as search. Mistral may polish grounded answers when configured, but sources remain visible.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <Card>
              <CardContent className="min-h-[360px] space-y-4 pt-6">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Start with a question. Answers stay inside retrieved evidence.</p>
                ) : null}
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-2xl rounded-md bg-primary p-3 text-sm text-primary-foreground" : "mr-auto max-w-3xl rounded-md border bg-card p-3 text-sm"}>
                    <p className="mb-1 font-medium">{message.role === "user" ? "You" : "YachayBot"}</p>
                    <p className="leading-6">{message.content}</p>
                    {message.answer ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant={message.answer.refused ? "destructive" : "secondary"}>{message.answer.evidenceStrength} evidence</Badge>
                        <Badge variant="outline">{message.answer.language}</Badge>
                        <Badge variant="outline">{message.modelUsed}</Badge>
                      </div>
                    ) : null}
                  </div>
                ))}
                {isLoading ? <p className="text-sm text-muted-foreground">Retrieving sources and drafting a grounded answer...</p> : null}
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </CardContent>
            </Card>

            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about EIB, public sources, heritage, language..."
                className="h-12"
                disabled={isLoading}
              />
              <Button type="submit" className="h-12" disabled={isLoading}>
                <Send className="size-4" />
                Send
              </Button>
            </form>
          </div>

          <aside className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Try a question</h2>
              <p className="text-sm text-muted-foreground">Examples use the indexed MVP corpus.</p>
            </div>
            <div className="space-y-2">
              {examples.map((example) => (
                <Button key={example} type="button" variant="outline" className="h-auto w-full justify-start whitespace-normal text-left" onClick={() => submitQuestion(example)} disabled={isLoading}>
                  {example}
                </Button>
              ))}
            </div>

            {messages.toReversed().find((message) => message.results?.length)?.results?.map((result) => (
              <Card key={result.chunkId}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{result.score.toFixed(2)}</Badge>
                    <Badge variant="outline">{result.language}</Badge>
                  </div>
                  <CardTitle className="leading-6">{result.title}</CardTitle>
                  <CardDescription>{result.institution}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>{result.snippet}</p>
                  <a className="inline-flex items-center gap-2 text-primary underline" href={result.sourceUrl} target="_blank" rel="noreferrer">
                    <BookOpenCheck className="size-4" />
                    Open source
                  </a>
                </CardContent>
              </Card>
            ))}
          </aside>
        </section>
      </main>
    </>
  );
}
