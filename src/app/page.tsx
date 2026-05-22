import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
          InPro.ai
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your AI agent runs your consulting business — 24/7 client chat,
          session summaries, and back-office automation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
