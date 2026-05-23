import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { consultants, services, agents, users } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { formatCents, formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { consultantSlug: string };
}) {
  const consultant = await getConsultantBySlug(params.consultantSlug);
  if (!consultant) return { title: "Consultant not found" };
  const name = consultant.user?.fullName ?? consultant.slug;
  return {
    title: `${name} — InPro.ai`,
    description: consultant.headline ?? `Book a session with ${name}`,
  };
}

async function getConsultantBySlug(slug: string) {
  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.slug, slug),
    with: {
      services: { where: eq(services.isActive, true) },
      agents: { where: eq(agents.isActive, true), limit: 1 },
      user: true,
    },
  });
  return consultant ?? null;
}

export default async function ConsultantProfilePage({
  params,
}: {
  params: { consultantSlug: string };
}) {
  const consultant = await getConsultantBySlug(params.consultantSlug);

  if (!consultant) notFound();

  const name = consultant.user?.fullName ?? consultant.slug;
  const avatar = consultant.user?.avatarUrl;
  const agent = consultant.agents?.[0];
  const activeServices = consultant.services ?? [];
  const lowestPrice = activeServices.length
    ? Math.min(...activeServices.map((s) => s.priceCents))
    : null;

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="InPro.ai" width={24} height={28} />
          <span className="text-sm font-bold text-[#1a2744]">
            InPro<span className="text-[#204ecf]">.ai</span>
          </span>
        </Link>
        <Link
          href="/consultants"
          className="text-sm text-gray-500 hover:text-[#1a2744] transition-colors"
        >
          ← Browse consultants
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* ── Main column ── */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Profile header card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="shrink-0">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#204ecf] text-2xl font-bold text-white shadow-md">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-[#1a2744]">{name}</h1>
                    {agent && (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        AI online
                      </span>
                    )}
                  </div>
                  {consultant.headline && (
                    <p className="text-base text-gray-700 font-medium mb-2">
                      {consultant.headline}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    {consultant.timezone && (
                      <span className="flex items-center gap-1">
                        <ClockIcon />
                        {consultant.timezone.replace(/_/g, " ")}
                      </span>
                    )}
                    {lowestPrice !== null && (
                      <span className="flex items-center gap-1">
                        <DollarIcon />
                        From {lowestPrice === 0 ? "Free" : formatCents(lowestPrice)}
                      </span>
                    )}
                    {activeServices.length > 0 && (
                      <span className="flex items-center gap-1">
                        <BriefcaseIcon />
                        {activeServices.length} service
                        {activeServices.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {consultant.bio && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h2 className="text-sm font-semibold text-[#1a2744] uppercase tracking-wide mb-2">
                    About
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {consultant.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Services */}
            {activeServices.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-[#1a2744] mb-4">
                  Services offered
                </h2>
                <div className="space-y-3">
                  {activeServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#f7f9fc] px-4 py-4"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="font-semibold text-[#1a2744] text-sm">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDuration(service.durationMinutes)} session
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-[#1a2744]">
                          {service.priceCents === 0
                            ? "Free"
                            : formatCents(service.priceCents)}
                        </p>
                        {agent && (
                          <button
                            className="mt-1.5 rounded-md bg-[#204ecf] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3fb5] transition-colors"
                            onClick={undefined}
                          >
                            Book
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No services placeholder */}
            {activeServices.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="text-sm text-gray-400">
                  No services listed yet.
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="w-full lg:w-[300px] shrink-0 space-y-4">
            {/* Chat CTA card */}
            {agent ? (
              <div className="rounded-xl border border-[#204ecf]/20 bg-white p-5 shadow-sm sticky top-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#204ecf] text-white font-bold text-sm shrink-0">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a2744]">{agent.name}</p>
                    <p className="text-xs text-gray-500">{name}&apos;s AI assistant</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Get answers about services, pricing, and availability — instantly.
                </p>
                <a
                  href={`/widget/${consultant.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-[#204ecf] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1a3fb5] transition-colors"
                >
                  Chat with {agent.name}
                </a>
                <p className="mt-2 text-center text-xs text-gray-400">
                  Powered by InPro.ai
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-400 text-center">
                  AI chat not available yet
                </p>
              </div>
            )}

            {/* Stats card */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Quick facts
              </h3>
              <ul className="space-y-2.5">
                <StatRow
                  label="Response time"
                  value={agent ? "Instant (AI)" : "Varies"}
                  highlight={!!agent}
                />
                <StatRow
                  label="Services"
                  value={`${activeServices.length} offered`}
                />
                {lowestPrice !== null && (
                  <StatRow
                    label="Starting at"
                    value={lowestPrice === 0 ? "Free" : formatCents(lowestPrice)}
                  />
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={
          highlight
            ? "font-semibold text-green-600"
            : "font-medium text-[#1a2744]"
        }
      >
        {value}
      </span>
    </li>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
