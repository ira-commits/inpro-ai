"use client";

import { useState } from "react";

interface GoLiveModalProps {
  slug: string;
  name: string;
  headline?: string | null;
  onClose: () => void;
}

export function GoLiveModal({ slug, name, headline, onClose }: GoLiveModalProps) {
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://inpro.ai/${slug}`;
  const firstName = name.split(" ")[0];

  const linkedInPost = `🚀 Excited to share something I've been building.

I just launched my consulting practice on InPro.ai — and I have an AI agent that can answer questions, share my services, and book sessions with clients 24/7.

${headline ? `I specialize in ${headline}.` : ""}

If you're looking for expert guidance or just want to explore what I offer, my AI is available right now at:
👉 ${profileUrl}

Whether you're a former colleague, a founder who needs a fresh perspective, or anyone navigating a challenge in my area — reach out. The conversation starts immediately.

#Consulting #OpenToWork #AI #InProAI`;

  function handleCopy() {
    navigator.clipboard.writeText(linkedInPost).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleLinkedIn() {
    window.open("https://www.linkedin.com/feed/", "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Green header */}
        <div className="bg-[#1a2744] px-6 py-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            You&apos;re live, {firstName}!
          </h2>
          <p className="mt-1 text-sm text-blue-200/70">
            Your AI is online at{" "}
            <a href={`/${slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#29B6F6] hover:underline">
              inpro.ai/{slug}
            </a>
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#1a2744] mb-1">
              Tell your LinkedIn network
            </p>
            <p className="text-xs text-gray-500">
              Your first clients are already following you. One post is all it takes.
            </p>
          </div>

          {/* Post preview */}
          <div className="rounded-xl border border-gray-200 bg-[#f7f9fc] p-4">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {linkedInPost}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                copied
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy post
                </>
              )}
            </button>
            <button
              onClick={handleLinkedIn}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#004182] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Post on LinkedIn
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            Skip for now — go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
