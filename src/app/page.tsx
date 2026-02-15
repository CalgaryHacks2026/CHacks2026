"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ContentItem } from "~/components/content-item";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Chip } from "~/components/ui/chip";

const SPECIFC_LOGO_URL =
  "https://raw.githubusercontent.com/CalgaryHacks2026/Image_Hosting/refs/heads/main/93f59d4e-c49f-40b1-8e67-90f8c75ffb64.png?token=GHSAT0AAAAAADSN554THCXE54TRMPSQUQNY2MRDIBQ";

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
  const posts = useQuery(api.post.get_posts, {})


  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto flex w-full flex-col items-center px-6 pt-16 text-center">
        {/* Search */}
        <div className="mt-8 w-full justify-center items-center flex flex-col">
          <div className="max-w-3xl w-full flex flex-col items-center gap-2 my-72">
            <div className="flex flex-row w-full items-center gap-2">
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
          <div className="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-zinc-500">Suggested:</span>
            {SUGGESTED.map((tag) => (
              <Chip
                key={tag}
                onClick={() => setQuery(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>
          </div>

          {/* Suggested tags */}
        </div>

        {posts?.map((post) => (
          <div key={post._id} className="mt-8">
            <p>Title: {post.title}</p>
            <p>Description: {post.description}</p>
          </div>
        ))}
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
