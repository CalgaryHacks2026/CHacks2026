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
                <ContentItem index={i} post={post} isSelected={selectedPost === post} deselect={() => setSelectedPost(null)} selectedTagNames={selectedTagNames} />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
