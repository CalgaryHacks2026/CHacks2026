"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ContentItem } from "~/components/content-item";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Chip } from "~/components/ui/chip";

const SUGGESTED = [
  "cars",
  "planes",
  "hollywood",
  "bikes",
  "calgary",
  "praries",
  "steampunk",
  "space",
  "art",
  "music",
  "food",
  "travel",
  "fashion",
  "tech",
  "games",
  "books",
  "movies",
] as const;

export default function Home() {
  const [query, setQuery] = useState("");
  const posts = useQuery(api.post.get_posts, {});
  const sectionRef = useRef<HTMLElement | null>(null);


  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Blurred background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-left blob */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-400/40 blur-3xl" />
        {/* Top-right blob */}
        <div className="absolute -right-32 -top-16 h-80 w-80 rounded-full bg-gradient-to-bl from-blue-400/30 to-cyan-400/30 blur-3xl" />
        {/* Center blob */}
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-3xl" />
        {/* Bottom-left blob */}
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/25 to-teal-400/25 blur-3xl" />
        {/* Bottom-right blob */}
        <div className="absolute -bottom-48 -right-24 h-96 w-96 rounded-full bg-gradient-to-tl from-orange-300/25 to-amber-300/25 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex w-full flex-col items-center px-6 pt-16 text-center">
        {/* Search */}
        <div className="mt-8 w-full justify-center items-center flex flex-col">
          <div className="max-w-3xl w-full flex flex-col items-center gap-2 h-[calc(76vh)]">
            <Image
              src="/memora_logo_lg.png"
              alt="Memora Logo"
              width={1536}
              height={1024}
              className="w-2xl"
            />
            <div className="flex flex-row w-full items-center gap-2">
              <Input
                className="h-12"
                placeholder="Search for anything in any era..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                className="h-12"
                variant="outline"
                onClick={() => {
                  sectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <SearchIcon /> Search
              </Button>
            </div>
            <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-zinc-500">Suggested:</span>
              {SUGGESTED.map((tag) => (
                <Chip key={tag} onClick={() => setQuery(tag)}>
                  {tag}
                </Chip>
              ))}
            </div>
          </div>

          {/* Suggested tags */}
        </div>
        {/*Section for loading posts area - Masonry Grid*/}
        <section ref={sectionRef} className="mt-12 w-full max-w-6xl px-4 scroll-mt-70">
          <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5 group">
            {Array.from({ length: 32 }).map((_, i) => {
              // Vary heights for masonry effect
              const heights = ["h-48", "h-56", "h-64", "h-72", "h-80", "h-96"];
              const heightClass =
                heights[(heights.length * Math.random()) >> 0];
              return (
                <div
                  key={i}
                  className={`mb-4 break-inside-avoid ${heightClass}`}
                >
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
