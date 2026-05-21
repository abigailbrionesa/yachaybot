import Link from "next/link";
import { Navbar } from "@/components/global/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documents, getChunksForDocument } from "@/lib/v2-data";
import type { LanguageCode, SourceType } from "@/lib/v2-types";

const languages: Array<"all" | LanguageCode> = ["all", "es", "en", "qu", "ay"];
const sourceTypes: Array<"all" | SourceType> = ["all", "official", "public", "curated"];

interface SourcesPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    language?: string;
    sourceType?: string;
    topic?: string;
  }>;
}

export default async function SourcesPage({ params, searchParams }: SourcesPageProps) {
  const { locale } = await params;
  const filters = await searchParams;
  const language = toLanguage(filters.language);
  const sourceType = toSourceType(filters.sourceType);
  const topic = filters.topic ?? "all";
  const topics = ["all", ...Array.from(new Set(documents.flatMap((document) => document.topicTags))).sort()];
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
            <Button key={item} asChild type="button" size="sm" variant={language === item ? "default" : "outline"}>
              <Link href={sourceHref(locale, { language: item, sourceType, topic })}>{item}</Link>
            </Button>
          ))}
          {sourceTypes.map((item) => (
            <Button key={item} asChild type="button" size="sm" variant={sourceType === item ? "default" : "outline"}>
              <Link href={sourceHref(locale, { language, sourceType: item, topic })}>{item}</Link>
            </Button>
          ))}
          {topics.map((item) => (
            <Button key={item} asChild type="button" size="sm" variant={topic === item ? "secondary" : "outline"}>
              <Link href={sourceHref(locale, { language, sourceType, topic: item })}>{item}</Link>
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
                  <CardDescription>{document.institution} - {document.region}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>{document.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {document.topicTags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                  <p className="text-muted-foreground">{document.rightsNote}</p>
                  <a className="text-primary underline" href={document.sourceUrl} target="_blank" rel="noreferrer">
                    Open source
                  </a>
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

function toLanguage(value: string | undefined): "all" | LanguageCode {
  return languages.includes(value as "all" | LanguageCode) ? value as "all" | LanguageCode : "all";
}

function toSourceType(value: string | undefined): "all" | SourceType {
  return sourceTypes.includes(value as "all" | SourceType) ? value as "all" | SourceType : "all";
}

function sourceHref(locale: string, filters: { language: string; sourceType: string; topic: string }) {
  const params = new URLSearchParams();
  if (filters.language !== "all") params.set("language", filters.language);
  if (filters.sourceType !== "all") params.set("sourceType", filters.sourceType);
  if (filters.topic !== "all") params.set("topic", filters.topic);
  const query = params.toString();
  const basePath = `/${locale}/sources`;
  return query ? `${basePath}?${query}` : basePath;
}
