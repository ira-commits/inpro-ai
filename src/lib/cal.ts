/**
 * Cal.com API v2 helpers.
 * Docs: https://cal.com/docs/api-reference
 *
 * All functions return null gracefully if CAL_API_KEY is not configured.
 */

const CAL_API_BASE = "https://api.cal.com/v1";

export interface CalSlot {
  time: string; // ISO 8601
}

export interface CalAvailability {
  slots: Record<string, CalSlot[]>; // keyed by date "YYYY-MM-DD"
}

/**
 * Get available slots for a Cal.com username over the next N days.
 * Returns null if Cal.com is not configured or request fails.
 */
export async function getAvailableSlots(
  calUsername: string,
  durationMinutes: number,
  daysAhead = 7
): Promise<CalAvailability | null> {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey || !calUsername) return null;

  const startTime = new Date();
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + daysAhead);

  const params = new URLSearchParams({
    apiKey,
    usernameList: calUsername,
    eventTypeSlug: "consultation", // default slug; can be overridden
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    timeZone: "UTC",
  });

  try {
    const res = await fetch(`${CAL_API_BASE}/slots?${params.toString()}`, {
      next: { revalidate: 0 }, // never cache — always live
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { slots: Record<string, CalSlot[]> };
    return data;
  } catch {
    return null;
  }
}

/**
 * Format a CalAvailability response into a human-readable string for the AI.
 */
export function formatAvailability(
  availability: CalAvailability,
  timezone = "UTC"
): string {
  const dates = Object.entries(availability.slots).slice(0, 5); // show max 5 days
  if (dates.length === 0) return "No available slots found in the next week.";

  const lines = dates.map(([date, slots]) => {
    if (!slots || slots.length === 0) return null;
    const times = slots.slice(0, 4).map((s) => {
      const d = new Date(s.time);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: timezone,
        timeZoneName: "short",
      });
    });
    const more = slots.length > 4 ? ` (+${slots.length - 4} more)` : "";
    return `${date}: ${times.join(", ")}${more}`;
  });

  return lines.filter(Boolean).join("\n");
}
