"use client";

import { Doc } from "../../convex/_generated/dataModel";

type PostWithUrl = Doc<"posts"> & {
  url?: string | null; // added by your query, not stored in schema
};

export const ContentItem = ({
  post,
  openDetailedModalAction,
  isSkeleton = false,
  index = 0,
  isSelected = false,
  deselect,
  selectedTagNames,
}: {
  post?: PostWithUrl;
  openDetailedModalAction?: (p: PostWithUrl) => void;
  isSkeleton?: boolean;
  index?: number;
  isSelected?: boolean;
  deselect?: () => void;
  selectedTagNames?: string[];
}) => {
  if (isSkeleton) {
    const pastelColors = [
      "bg-blue-950",
      "bg-pink-950",
      "bg-emerald-950",
      "bg-amber-950",
      "bg-violet-950",
      "bg-rose-950",
      "bg-cyan-950",
      "bg-lime-950",
    ];
    const colorClass = pastelColors[index % pastelColors.length];

    return (
      <div
        className={`h-full w-full rounded-xl ${colorClass} animate-pulse`}
        style={{ animationDelay: `${index * 0.1}s` }}
      />
    );
  }

  return (
    <>

    <button
      key={post?._id}
      className="bg-card h-full w-full border hover:shadow-2xl hover:scale-125 transition-all duration-300 ease-out cursor-pointer hover:before:opacity-65 relative hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-full hover:before:h-full z-0 hover:z-50 group-hover:saturate-0 group-hover:hover:saturate-100!"
      style={{
        backgroundImage: post?.url ? `url(${post.url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => post && openDetailedModalAction?.(post)}
      />
      {/* VIEW MODAL */}
      {isSelected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => deselect?.()}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => deselect?.()}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Close
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
              {/* LEFT: Image */}
              <div className="bg-black/30 p-4">
                {post?.url ? (
                  <img
                    src={post?.url}
                    alt={post?.title ?? "Post"}
                    className="max-h-[85vh] w-full object-contain"
                  />
                ) : (
                  <div className="flex h-[50vh] items-center justify-center text-white/70">
                    No image URL found on this post yet.
                  </div>
                )}
              </div>

              {/* RIGHT: Metadata */}
              <div className="p-6 text-white">
                <h2 className="text-xl font-semibold">
                  {post?.title ?? "Untitled"}
                </h2>

                {/* YEAR (only shows if it's actually saved in Convex) */}
                <div className="mt-3 text-sm text-white/80">
                  <span className="text-white/60">Year:</span>{" "}
                  {post?.year ?? "—"}
                </div>

                {/* TAGS */}
                <div className="mt-4">
                  <div className="text-sm text-white/60">Tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTagNames?.length ? (
                      selectedTagNames?.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                        >
                          #{t}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-white/70">No tags</span>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-5">
                  <div className="text-sm text-white/60">Description</div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-white/90">
                    {post?.description?.trim() ? post?.description : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
