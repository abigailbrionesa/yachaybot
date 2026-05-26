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
            Local deterministic eval run for inspecting retrieval quality, refusal behavior, citation behavior, latency, and failed or risky cases.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-6">
          <Metric title="Top-1 hit rate" value={`${Math.round(run.metrics.top1HitRate * 100)}%`} />
          <Metric title="Top-3 hit rate" value={`${Math.round(run.metrics.top3HitRate * 100)}%`} />
          <Metric title="Top-5 hit rate" value={`${Math.round(run.metrics.top5HitRate * 100)}%`} />
          <Metric title="MRR" value={run.metrics.meanReciprocalRank.toFixed(2)} />
          <Metric title="Precision@3" value={run.metrics.precisionAt3.toFixed(2)} />
          <Metric title="Recall@5" value={run.metrics.recallAt5.toFixed(2)} />
          <Metric title="Refusal pass rate" value={`${Math.round(run.metrics.refusalPassRate * 100)}%`} />
          <Metric title="False refusal" value={`${Math.round(run.metrics.refusalFalsePositiveRate * 100)}%`} />
          <Metric title="Missed refusal" value={`${Math.round(run.metrics.refusalFalseNegativeRate * 100)}%`} />
          <Metric title="Citation coverage" value={`${Math.round(run.metrics.citationCoverage * 100)}%`} />
          <Metric title="Latency p50" value={`${run.metrics.p50LatencyMs}ms`} />
          <Metric title="Latency p95" value={`${run.metrics.p95LatencyMs}ms`} />
        </section>

        <section className="grid gap-4">
          {run.results.map((result) => {
            const failed = result.expectedDocumentId
              ? !result.top5Hit || !result.citationPassed
              : !result.refusalPassed || !result.citationPassed;

            return (
              <Card key={result.questionId} className={failed ? "border-destructive" : ""}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={failed ? "destructive" : "secondary"}>{failed ? "failed" : "passed"}</Badge>
                    <Badge variant="outline">{result.language}</Badge>
                    <Badge variant="outline">{result.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{result.question}</CardTitle>
                  <CardDescription>{result.questionId} - latency {result.latencyMs}ms</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm md:grid-cols-2">
                  <p><span className="font-medium">Expected:</span> {result.expectedDocumentId ?? "refusal"}</p>
                  <p><span className="font-medium">Acceptable:</span> {result.acceptableDocumentIds.join(", ") || "none"}</p>
                  <p><span className="font-medium">Retrieved:</span> {result.retrievedDocumentIds.join(", ") || "none"}</p>
                  <p><span className="font-medium">Top-1:</span> {String(result.top1Hit)}</p>
                  <p><span className="font-medium">Top-3:</span> {String(result.top3Hit)}</p>
                  <p><span className="font-medium">Top-5:</span> {String(result.top5Hit)}</p>
                  <p><span className="font-medium">MRR contribution:</span> {result.reciprocalRank.toFixed(2)}</p>
                  <p><span className="font-medium">Precision@3:</span> {result.precisionAt3.toFixed(2)}</p>
                  <p><span className="font-medium">Recall@5:</span> {result.recallAt5.toFixed(2)}</p>
                  <p><span className="font-medium">Answer refused:</span> {String(result.answerRefused)}</p>
                  <p><span className="font-medium">Refusal passed:</span> {String(result.refusalPassed)}</p>
                  <p><span className="font-medium">Citation markers:</span> {result.citationMarkers.join(", ") || "none"}</p>
                  <p><span className="font-medium">Citation passed:</span> {String(result.citationPassed)}</p>
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
