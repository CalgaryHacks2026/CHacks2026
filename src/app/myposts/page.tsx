"use client";

// src/app/myposts/page.tsx
import { useMemo, useState } from "react";

type Collage = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  images: string[]; // sample image urls
};

export default function MyPosts() {
  const collages: Collage[] = useMemo(
    () => [
      {
        id: "c1",
        title: "Weekend Finds",
        subtitle: "Cars • Street • Neon",
        tags: ["cars", "street", "neon"],
        images: [
          "https://picsum.photos/seed/collagio-car-1/900/600",
          "https://picsum.photos/seed/collagio-car-2/900/600",
          "https://picsum.photos/seed/collagio-car-3/900/600",
          "https://picsum.photos/seed/collagio-car-4/900/600",
        ],
      },
      {
        id: "c2",
        title: "Studio Moodboard",
        subtitle: "Chairs • Wood • Design",
        tags: ["chairs", "wood", "design"],
        images: [
          "https://picsum.photos/seed/collagio-chair-1/900/600",
          "https://picsum.photos/seed/collagio-chair-2/900/600",
          "https://picsum.photos/seed/collagio-chair-3/900/600",
          "https://picsum.photos/seed/collagio-chair-4/900/600",
        ],
      },
      {
        id: "c3",
        title: "Ride Diary",
        subtitle: "Bikes • Trails • Summer",
        tags: ["bikes", "trails", "summer"],
        images: [
          "https://picsum.photos/seed/collagio-bike-1/900/600",
          "https://picsum.photos/seed/collagio-bike-2/900/600",
          "https://picsum.photos/seed/collagio-bike-3/900/600",
          "https://picsum.photos/seed/collagio-bike-4/900/600",
        ],
      },
      {
        id: "c4",
        title: "Random Collection",
        subtitle: "Mixed • Tagged • Saved",
        tags: ["random", "mixed", "saved"],
        images: [
          "https://picsum.photos/seed/collagio-mix-1/900/600",
          "https://picsum.photos/seed/collagio-mix-2/900/600",
          "https://picsum.photos/seed/collagio-mix-3/900/600",
          "https://picsum.photos/seed/collagio-mix-4/900/600",
        ],
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState(collages[0]?.id ?? "");
  const active = collages.find((c) => c.id === activeId) ?? collages[0];

  return (
    <main className="min-h-screen bg-white p-6 text-zinc-900">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header row */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Page</h1>
            <p className="mt-2 text-zinc-600">A list of my collages.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              // TODO: later route to a create page or open a modal
              alert("Add New Collage clicked!");
            }}
            className="h-10 rounded-full bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Add New Collage
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Collage cards */}
          <section>
            <div className="grid gap-4 sm:grid-cols-2">
              {collages.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={[
                      "group text-left rounded-3xl border p-4 shadow-sm transition",
                      "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md",
                      isActive ? "ring-4 ring-blue-100 border-blue-300" : "",
                    ].join(" ")}
                  >
                    {/* Mini collage preview */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                        <img
                          src={c.images[0]}
                          alt={`${c.title} preview 1`}
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-zinc-100">
                          <img
                            src={c.images[1]}
                            alt={`${c.title} preview 2`}
                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                        <div className="aspect-square overflow-hidden rounded-2xl bg-zinc-100">
                          <img
                            src={c.images[2]}
                            alt={`${c.title} preview 3`}
                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold">{c.title}</h2>
                        <span className="text-xs text-zinc-500">
                          {isActive ? "Selected" : "View"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-600">{c.subtitle}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: Selected collage images */}
          <aside className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">
                  {active ? active.title : "Select a collage"}
                </h3>
                <p className="mt-1 text-xs text-zinc-600">
                  Click a collage to preview its images.
                </p>
              </div>

              {/* Color dots (Collagio palette vibe) */}
              <div className="flex gap-1.5 pt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {active?.images?.map((url, i) => (
                <div
                  key={url}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                >
                  <img
                    src={url}
                    alt={`${active.title} image ${i + 1}`}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
