export default function EarningsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="text-muted-foreground mt-1">Track your revenue and payouts.</p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground text-sm">Connect Stripe to start tracking earnings.</p>
        <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors opacity-50 cursor-not-allowed">
          Connect Stripe — coming soon
        </button>
      </div>
    </div>
  );
}
