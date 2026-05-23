import { db } from "@/server/db";
import { consultants, services, agents } from "@/server/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { formatCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Find a consultant — InPro.ai",
  description:
    "Browse AI-powered consultants. Book instantly, chat 24/7.",
};

const SPECIALTIES = [
  "Business Strategy",
  "Executive Coaching",
  "Career Development",
  "Marketing",
  "Finance",
  "Tech & Product",
  "Leadership",
  "Sales",
];

async function getConsultants(query?: string) {
  const rows = await db.query.consultants.findMany({
    where: and(
      eq(consultants.isPublished, true),
      query
        ? or(
            ilike(consultants.headline, `%${query}%`),
            ilike(consultants.bio, `%${query}%`),
            ilike(consultants.slug, `%${query}%`)
          )
        : undefined
    ),
    with: {
      services: { where: eq(services.isActive, true) },
      agents: { where: eq(agents.isActive, true), limit: 1 },
      user: true,
    },
    limit: 48,
  });
  return rows;
}

export default async function ConsultantsPage({
  searchParams,
}: {
  searchParams: { q?: string; specialty?: string };
}) {
  const q = searchParams.q?.trim() || searchParams.specialty || undefined;
  const results = await getConsultants(q);

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
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-[#1a2744]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[#204ecf] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1a3fb5] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero search */}
      <div className="bg-[#1a2744] px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Find your expert
        </h1>
        <p className="text-blue-200 text-sm mb-6">
          Every consultant comes with an AI that&apos;s available 24/7
        </p>
        <form method="GET" action="/consultants" className="mx-auto max-w-lg">
          <div className="flex gap-2">
            <input
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Search by expertise, industry, or name..."
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#29B6F6] px-5 py-2.5 text-sm font-semibold text-[#1a2744] hover:bg-[#29B6F6]/90 transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Specialty chips */}
      <div className="border-b border-gray-200 bg-white px-6 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <Link
            href="/consultants"
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              !q
                ? "bg-[#204ecf] text-white"
                : "border border-gray-200 text-gray-600 hover:border-[#204ecf] hover:text-[#204ecf]"
            }`}
          >
            All
          </Link>
          {SPECIALTIES.map((s) => (
            <Link
              key={s}
              href={`/consultants?specialty=${encodeURIComponent(s)}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                searchParams.specialty === s
                  ? "bg-[#204ecf] text-white"
                  : "border border-gray-200 text-gray-600 hover:border-[#204ecf] hover:text-[#204ecf]"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {q && (
          <p className="text-sm text-gray-500 mb-5">
            {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
            <span className="font-semibold text-[#1a2744]">&ldquo;{q}&rdquo;</span>
          </p>
        )}

        {results.length === 0 ? (
          <EmptyState query={q} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type ConsultantRow = Awaited<ReturnType<typeof getConsultants>>[number];

function ConsultantCard({ consultant }: { consultant: ConsultantRow }) {
  const name = consultant.user?.fullName ?? consultant.slug;
  const avatar = consultant.user?.avatarUrl;
  const agent = consultant.agents?.[0];
  const activeServices = consultant.services ?? [];
  const lowestPrice = activeServices.length
    ? Math.min(...activeServices.map((s) => s.priceCents))
    : null;

  return (
    <Link
      href={`/${consultant.slug}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#204ecf]/30 transition-all duration-200 overflow-hidden"
    >
      {/* Card header */}
      <div className="p-5 flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 relative">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#204ecf] text-xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {agent && (
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1a2744] text-sm truncate group-hover:text-[#204ecf] transition-colors">
            {name}
          </p>
          {consultant.headline && (
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
              {consultant.headline}
            </p>
          )}
        </div>
      </div>

      {/* Services preview */}
      {activeServices.length > 0 && (
        <div className="px-5 pb-4 flex-1">
          <div className="space-y-1.5">
            {activeServices.slice(0, 2).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 truncate mr-2">{s.name}</span>
                <span className="font-semibold text-[#1a2744] shrink-0">
                  {s.priceCents === 0 ? "Free" : formatCents(s.priceCents)}
                </span>
              </div>
            ))}
            {activeServices.length > 2 && (
              <p className="text-xs text-gray-400">
                +{activeServices.length - 2} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-[#f7f9fc]">
        {lowestPrice !== null ? (
          <span className="text-xs text-gray-500">
            From{" "}
            <span className="font-bold text-[#1a2744]">
              {lowestPrice === 0 ? "Free" : formatCents(lowestPrice)}
            </span>
          </span>
        ) : (
          <span className="text-xs text-gray-400">No services listed</span>
        )}
        {agent ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            AI available
          </span>
        ) : (
          <span className="text-xs text-gray-400">No AI yet</span>
        )}
      </div>
    </Link>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
        <svg
          className="h-8 w-8 text-[#204ecf]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-[#1a2744] mb-1">
        {query ? `No results for "${query}"` : "No consultants yet"}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {query
          ? "Try a different search term or browse all consultants."
          : "Be the first — create your profile and go live today."}
      </p>
      <div className="mt-5 flex gap-3">
        {query && (
          <Link
            href="/consultants"
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Clear search
          </Link>
        )}
        <Link
          href="/signup"
          className="rounded-md bg-[#204ecf] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a3fb5] transition-colors"
        >
          Become a consultant
        </Link>
      </div>
    </div>
  );
}
