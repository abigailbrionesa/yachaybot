"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/global/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documents, getChunksForDocument, type LanguageCode, type SourceType } from "@/lib/v2-data";

const languages: Array<"all" | LanguageCode> = ["all", "es", "en", "qu", "ay"];
const sourceTypes: Array<"all" | SourceType> = ["all", "official", "public", "curated"];

export default function SourcesPage() {
  const [language, setLanguage] = useState<"all" | LanguageCode>("all");
  const [sourceType, setSourceType] = useState<"all" | SourceType>("all");
  const [topic, setTopic] = useState("all");

  const topics = useMemo(() => ["all", ...Array.from(new Set(documents.flatMap((document) => document.topicTags))).sort()], []);
  const filtered = documents.filter((document) => {
    return (language === "all" || document.language === language)
      && (sourceType === "all" || document.sourceType === sourceType)
      && (topic === "all" || document.topicTags.includes(topic));
  });

  return (
    <>
      <Navbar />
      <main className="container space-y-8 pt-28 pb-16">
        <section className="space-y-3">
          <Badge variant="outline">Sources</Badge>
          <h1 className="text-4xl font-bold">Inspectable source records</h1>
          <p className="max-w-3xl text-muted-foreground">
            The MVP corpus includes public or official sources plus curated project notes. Curated notes are labeled and are not primary sources.
          </p>
        </section>

        <section className="flex flex-wrap gap-3">
          {languages.map((item) => (
            <Button key={item} type="button" size="sm" variant={language === item ? "default" : "outline"} onClick={() => setLanguage(item)}>
              {item}
            </Button>
          ))}
          {sourceTypes.map((item) => (
            <Button key={item} type="button" size="sm" variant={sourceType === item ? "default" : "outline"} onClick={() => setSourceType(item)}>
              {item}
            </Button>
          ))}
          {topics.map((item) => (
            <Button key={item} type="button" size="sm" variant={topic === item ? "secondary" : "outline"} onClick={() => setTopic(item)}>
              {item}
            </Button>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {filtered.map((document) => {
            const chunks = getChunksForDocument(document.id);
            return (
              <Card key={document.id}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{document.language}</Badge>
                    <Badge variant={document.sourceType === "curated" ? "secondary" : "outline"}>{document.sourceType}</Badge>
                  </div>
                  <CardTitle>{document.title}</CardTitle>
                  <CardDescription>{document.institution} · {document.region}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>{document.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {document.topicTags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                  <p className="text-muted-foreground">{document.rightsNote}</p>
                  <a className="text-primary underline" href={document.sourceUrl} target="_blank">Open source</a>
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="mb-2 font-medium">Inspectable chunks</p>
                    {chunks.map((chunk) => (
                      <p key={chunk.id} className="text-muted-foreground">
                        {chunk.chunkIndex}: {chunk.content} ({chunk.charCount} chars)
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </>
  );
}
