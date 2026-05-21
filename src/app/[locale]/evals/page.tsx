import { Navbar } from "@/components/global/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { runEval } from "@/lib/v2-data";

export default function EvalsPage() {
  const run = runEval();

  return (
    <>
      <Navbar />
      <main className="container space-y-8 pt-28 pb-16">
        <section className="space-y-3">
          <Badge variant="outline">Evals</Badge>
          <h1 className="text-4xl font-bold">Retrieval eval dashboard</h1>
          <p className="max-w-3xl text-muted-foreground">
            Local deterministic eval run for inspecting retrieval quality, refusal behavior, expected sources, and failed cases.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="Top-3 hit rate" value={`${Math.round(run.metrics.top3HitRate * 100)}%`} />
          <Metric title="Top-5 hit rate" value={`${Math.round(run.metrics.top5HitRate * 100)}%`} />
          <Metric title="Refusal pass rate" value={`${Math.round(run.metrics.refusalPassRate * 100)}%`} />
          <Metric title="Avg latency" value={`${run.metrics.averageLatencyMs}ms`} />
        </section>

        <section className="grid gap-4">
          {run.results.map((result) => {
            const failed = result.expectedDocumentId
              ? !result.top5Hit
              : !result.refusalPassed;
            return (
              <Card key={result.questionId} className={failed ? "border-destructive" : ""}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={failed ? "destructive" : "secondary"}>{failed ? "failed" : "passed"}</Badge>
                    <Badge variant="outline">{result.language}</Badge>
                  </div>
                  <CardTitle className="text-lg">{result.question}</CardTitle>
                  <CardDescription>{result.questionId} · latency {result.latencyMs}ms</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm md:grid-cols-2">
                  <p><span className="font-medium">Expected:</span> {result.expectedDocumentId ?? "refusal"}</p>
                  <p><span className="font-medium">Retrieved:</span> {result.retrievedDocumentIds.join(", ") || "none"}</p>
                  <p><span className="font-medium">Top-3:</span> {String(result.top3Hit)}</p>
                  <p><span className="font-medium">Top-5:</span> {String(result.top5Hit)}</p>
                  <p><span className="font-medium">Refusal:</span> {String(result.refusalPassed)}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
