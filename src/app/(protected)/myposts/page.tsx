"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSettingsContext } from "~/hooks/useSettingsContext";
import FileUploader from "~/components/fileuploader";
import { ContentItem } from "~/components/content-item";
import { useMemo, useState, useEffect } from "react";

export default function MyPosts() {
  const { isDebug } = useSettingsContext();

  const posts = useQuery(api.post.get_post_for_user, {});
  const allTags = useQuery(api.tag.get_tags);

  // Build a quick lookup: tagId -> tagName
  const tagNameById = useMemo(() => {
    const m = new Map<string, string>();
    (allTags ?? []).forEach((t) => m.set(String(t._id), t.name));
    return m;
  }, [allTags]);

  // Just keeping your uploader state (even if not used here yet)
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "audio" | "unknown">(
    "unknown",
  );

  // Modal state (what was clicked)
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Pull the image URL from Convex using storageId (skip when modal closed)
  const selectedFileUrl = useQuery(
    api.post.get_file_url,
    selectedPost?.storageId ? { storageId: selectedPost.storageId } : "skip",
  );

  // ESC to close modal
  useEffect(() => {
    if (!selectedPost) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPost]);

  // Tags on the post might be stored as IDs in setOfUserTags
  const selectedTagNames = useMemo(() => {
    if (!selectedPost) return [];
    const ids: unknown[] =
      selectedPost.setOfUserTags ?? selectedPost.tags ?? selectedPost.tagIds ?? [];
    if (!Array.isArray(ids)) return [];
    return ids.map((id) => tagNameById.get(String(id)) ?? String(id));
  }, [selectedPost, tagNameById]);

  const modalSrc =
    typeof selectedFileUrl === "string"
      ? selectedFileUrl
      : // fallback if you ever store a direct url on the post
        (selectedPost?.mediaUrl as string | undefined) ?? "";

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center">
      {isDebug && <pre>{JSON.stringify(posts, null, 2)}</pre>}

      <div className="max-w-3xl w-full">
        <FileUploader
          accept="image-audio"
          maxFiles={1}
          maxSizeMb={10}
          onChange={({ file, url, kind }) => {
            setMediaFile(file);
            setMediaUrl(url);
            setMediaType(kind);
          }}
        />
      </div>

      <section className="mt-12 w-full max-w-6xl px-4">
        <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5 group">
          {posts?.map((post, i) => {
            const heights = ["h-48", "h-56", "h-64", "h-72", "h-80", "h-96"];
            const heightClass = heights[(heights.length * Math.random()) >> 0];

            return (
              <div
                key={post._id ?? i}
                className={`mb-4 break-inside-avoid ${heightClass} cursor-pointer`}
                onClick={() => setSelectedPost(post)}
              >
                <ContentItem index={i} post={post} />
              </div>
            );
          })}
        </div>
      </section>

      {/* VIEW MODAL */}
      {selectedPost ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Close
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
              {/* LEFT: Image */}
              <div className="bg-black/30 p-4">
                {modalSrc ? (
                  <img
                    src={modalSrc}
                    alt={selectedPost.title ?? "Post"}
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
                  {selectedPost.title ?? "Untitled"}
                </h2>

                {/* YEAR (only shows if it's actually saved in Convex) */}
                <div className="mt-3 text-sm text-white/80">
                  <span className="text-white/60">Year:</span>{" "}
                  {selectedPost.year ?? "—"}
                </div>

                {/* TAGS */}
                <div className="mt-4">
                  <div className="text-sm text-white/60">Tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTagNames.length ? (
                      selectedTagNames.map((t) => (
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
                    {selectedPost.description?.trim() ? selectedPost.description : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
