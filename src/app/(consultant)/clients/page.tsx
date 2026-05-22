export default function ClientsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground mt-1">View and manage your client relationships.</p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground text-sm">Clients will appear here once they book sessions with you.</p>
      </div>
    </div>
  );
}
