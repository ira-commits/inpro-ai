import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, sessions, services, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatCents, formatDuration } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  live: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-gray-50 text-gray-700 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  no_show: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
  });
  if (!consultant) redirect("/onboarding");

  const allSessions = await db.query.sessions.findMany({
    where: eq(sessions.consultantId, consultant.id),
    with: { service: true },
    orderBy: [desc(sessions.scheduledAt)],
    limit: 50,
  });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-1">Your scheduled and past consulting sessions.</p>
        </div>
      </div>

      {allSessions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No sessions yet.</p>
          <p className="text-muted-foreground text-xs mt-1">Sessions will appear here once clients book with you.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date & Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allSessions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {new Date(s.scheduledAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                    <span className="block text-xs text-muted-foreground font-normal">
                      {new Date(s.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "numeric", minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.service?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDuration(s.durationMinutes)}</td>
                  <td className="px-4 py-3 text-foreground">
                    {s.amountCents ? formatCents(s.amountCents) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[s.status] ?? ""}`}>
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
