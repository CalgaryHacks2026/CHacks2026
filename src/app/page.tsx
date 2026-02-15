"use client";

import Image from "next/image";
import { useState } from "react";

const SPECIFC_LOGO_URL =
  "https://raw.githubusercontent.com/CalgaryHacks2026/Image_Hosting/refs/heads/main/93f59d4e-c49f-40b1-8e67-90f8c75ffb64.png?token=GHSAT0AAAAAADSN554THCXE54TRMPSQUQNY2MRDIBQ";

const SUGGESTED = ["cars", "chairs", "bikes"] as const;

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-zinc-200">
            <Image
              src={SPECIFC_LOGO_URL}
              alt="Collagio logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">Collagio</span>
        </div>
      </header>

      {/* Center content */}
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-16 text-center">
        {/* Accent dots */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          <span className="h-2 w-2 rounded-full bg-pink-500" />
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="ml-2">Search your archive by tag</span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Find anything in your{" "}
          <span className="bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
            Collagio
          </span>
          .
        </h1>

        {/* Search */}
        <div className="mt-8 w-full">
          <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm focus-within:ring-4 focus-within:ring-blue-100">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tags"
              className="h-11 w-full rounded-xl bg-white px-4 text-sm outline-none placeholder:text-zinc-400"
            />

            <button
              type="button"
              className="h-11 whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              onClick={() => {
                // For now just keep it simple—later this can route or trigger a search.
                // Example: router.push(`/search?tag=${encodeURIComponent(query)}`)
              }}
            >
              Search
            </button>
          </div>

          {/* Suggested tags */}
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-zinc-500">Suggested:</span>
            {SUGGESTED.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-xl text-sm leading-6 text-zinc-500">
          Tip: tags can be anything — people, places, projects, vibes.
        </p>
      </main>
    </div>
  );
}
