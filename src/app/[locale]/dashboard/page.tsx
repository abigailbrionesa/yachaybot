import Link from "next/link";
import { Navbar } from "@/components/global/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  return (
    <>
      <Navbar />
      <main className="container flex min-h-svh items-center justify-center pt-24">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>
              <h1>Educator workspace is paused for the v2 MVP</h1>
            </CardTitle>
            <CardDescription>
              The current public release focuses on source-grounded search, visible citations, and retrieval evals.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${locale}`}>Back to search</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/sources`}>View sources</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
