import Link from "next/link";
import { Navbar } from "@/components/global/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SignInPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;

  return (
    <>
      <Navbar />
      <main className="container flex min-h-svh items-center justify-center pt-24">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Accounts are paused for the v2 MVP</CardTitle>
            <CardDescription>
              The public demo does not need sign-in yet. The current release keeps the experience focused on search, sources, and evals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Authentication will return when there is a protected educator workspace or source administration workflow.
            </p>
            <Button asChild>
              <Link href={`/${locale}`}>Back to search</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
