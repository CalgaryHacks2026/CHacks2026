"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ContentItem } from "~/components/content-item";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SearchIcon } from "lucide-react";

const SPECIFC_LOGO_URL =
  "https://raw.githubusercontent.com/CalgaryHacks2026/Image_Hosting/refs/heads/main/93f59d4e-c49f-40b1-8e67-90f8c75ffb64.png?token=GHSAT0AAAAAADSN554THCXE54TRMPSQUQNY2MRDIBQ";

const SUGGESTED = ["cars", "chairs", "bikes"] as const;

export default function Home() {
  const [query, setQuery] = useState("");
  const posts = useQuery(api.post.get_posts, {})


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
      <main className="mx-auto flex w-full flex-col items-center px-6 pt-16 text-center">
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
        <div className="mt-8 w-full justify-center items-center flex flex-col">
          <div className="max-w-3xl w-full flex flex-row items-center gap-2">

            <Input
              className="h-12"
              placeholder="Search for anything in any era"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              className="h-12"
              variant="outline"
            >
              <SearchIcon /> Search
            </Button>
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

        {posts?.map((post) => (
          <div key={post._id} className="mt-8">
            <p>Title: {post.title}</p>
            <p>Description: {post.description}</p>
          </div>
        ))}

        <p className="mt-8 max-w-xl text-sm leading-6 text-zinc-500">
          Tip: tags can be anything — people, places, projects, vibes.
        </p>

        {/*Section for loading posts area - Masonry Grid*/}
        <section className="mt-12 w-full max-w-6xl px-4">
          <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
            {Array.from({ length:32 }).map((_, i) => {
              // Vary heights for masonry effect
              const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80', 'h-96'];
              const heightClass = heights[heights.length * Math.random() >> 0];
              return (
                <div key={i} className={`mb-4 break-inside-avoid ${heightClass}`}>
                  <ContentItem isSkeleton index={i} />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
