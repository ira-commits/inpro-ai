"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ChatWidgetProps {
  consultantId: string;
  agentName: string;
  greeting: string;
  consultantName: string;
}

export function ChatWidget({
  consultantId,
  agentName,
  greeting,
  consultantName,
}: ChatWidgetProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/agent/chat",
      body: { consultantId, conversationId },
      initialMessages: [
        {
          id: "greeting",
          role: "assistant",
          content: greeting || `Hi! I'm ${agentName}, ${consultantName}'s AI assistant. How can I help you today?`,
        },
      ],
      onResponse: (response) => {
        const id = response.headers.get("X-Conversation-Id");
        if (id) setConversationId(id);
      },
    });

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-[#1a2744] px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#29B6F6] text-white font-bold text-base select-none">
          {agentName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">{agentName}</p>
          <p className="text-xs text-blue-200/70">AI assistant for {consultantName}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-xs text-blue-200/70">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#204ecf] text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
              Something went wrong. Please try again.
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-100 px-3 py-3 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder={`Message ${agentName}...`}
          disabled={isLoading}
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#204ecf]/30 focus:border-[#204ecf] disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#204ecf] text-white hover:bg-[#1a3fa8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <svg className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Powered by */}
      <div className="flex justify-center pb-2">
        <a
          href="https://inpro.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-gray-400 transition-colors"
        >
          Powered by
          <Image src="/logo.png" alt="InPro.ai" width={40} height={18} className="opacity-50 hover:opacity-70 transition-opacity" />
        </a>
      </div>
    </div>
  );
}
