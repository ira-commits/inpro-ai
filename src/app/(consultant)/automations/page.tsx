import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { consultants, automations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { AutomationToggles } from "@/components/consultant/automation-toggles";

const AUTOMATION_DEFINITIONS = [
  {
    type: "auto_confirm_booking" as const,
    title: "Auto-confirm bookings",
    description: "Automatically confirm new bookings without manual approval. Clients receive an instant confirmation email.",
    pillar: "Back-Office",
  },
  {
    type: "post_session_followup" as const,
    title: "Post-session follow-up",
    description: "After every session, automatically send the client a summary email with action items and next steps.",
    pillar: "Live Session Intel",
  },
  {
    type: "proposal_generator" as const,
    title: "Proposal generator",
    description: "Let your AI draft service proposals for qualified leads based on the conversation context.",
    pillar: "Back-Office",
  },
  {
    type: "no_show_rebooking" as const,
    title: "No-show re-booking",
    description: "When a client no-shows, automatically send a re-booking email with available slots.",
    pillar: "Back-Office",
  },
];

export default async function AutomationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, user.id),
  });
  if (!consultant) redirect("/onboarding");

  const existingAutomations = await db.query.automations.findMany({
    where: eq(automations.consultantId, consultant.id),
  });

  const automationMap = Object.fromEntries(
    existingAutomations.map((a) => [a.type, a])
  );

  const automationsWithState = AUTOMATION_DEFINITIONS.map((def) => ({
    ...def,
    id: automationMap[def.type]?.id ?? null,
    isEnabled: automationMap[def.type]?.isEnabled ?? false,
  }));

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Automations</h1>
        <p className="text-muted-foreground mt-1">
          Toggle automations to let your AI handle repetitive back-office tasks.
        </p>
      </div>
      <AutomationToggles
        consultantId={consultant.id}
        automations={automationsWithState}
      />
    </div>
  );
}
