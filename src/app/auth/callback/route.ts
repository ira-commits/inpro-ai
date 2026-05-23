import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/server/db";
import { consultants, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const u = data.user;
      const meta = u.user_metadata ?? {};

      // Pull what LinkedIn OIDC sends us:
      // full_name, avatar_url (profile picture), email
      const fullName: string | null =
        meta.full_name ?? meta.name ?? null;
      const avatarUrl: string | null =
        meta.avatar_url ?? meta.picture ?? null;

      // Upsert into public users table — keep in sync with auth
      await db
        .insert(users)
        .values({
          id: u.id,
          email: u.email ?? "",
          fullName,
          avatarUrl,
          role: "consultant",
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            // Always refresh name + avatar so changes on LinkedIn reflect here
            fullName,
            avatarUrl,
          },
        });

      // Check if consultant profile exists — if not, send to onboarding
      const existing = await db.query.consultants.findFirst({
        where: eq(consultants.userId, u.id),
      });

      const next = existing ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
