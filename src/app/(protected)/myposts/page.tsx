"use client";

// src/app/myposts/page.tsx
import { useMemo, useState } from "react";

type MediaType = "image" | "audio";

type Post = {
  id: string;
  title: string;
  subtitle: string;
  year: number;
  tags: string[];
  description: string;

  // for demo preview (later you’d store a real URL from your backend)
  mediaType: MediaType;
  mediaUrl: string; // objectURL for local preview or remote URL
};

function slugifyTag(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

function isSupportedImage(file: File) {
  return ["image/jpeg", "image/png"].includes(file.type);
}

function isSupportedAudio(file: File) {
  return ["audio/mpeg", "audio/wav"].includes(file.type);
}

export default function MyPosts() {
  const seedPosts: Post[] = useMemo(
    () => [
      {
        id: "p1",
        title: "Weekend Finds",
        subtitle: "Cars • Street • Neon",
        year: 2025,
        tags: ["cars", "street", "neon"],
        description: "A quick set of street moments from the weekend.",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/collagio-car-1/1200/800",
      },
      {
        id: "p2",
        title: "Studio Moodboard",
        subtitle: "Chairs • Wood • Design",
        year: 2024,
        tags: ["chairs", "wood", "design"],
        description: "Design references for studio vibe + furniture shapes.",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/collagio-chair-1/1200/800",
      },
      {
        id: "p3",
        title: "Ride Diary",
        subtitle: "Bikes • Trails • Summer",
        year: 2023,
        tags: ["bikes", "trails", "summer"],
        description: "Trail rides and summer light.",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/collagio-bike-1/1200/800",
      },
      {
        id: "p4",
        title: "Random Collection",
        subtitle: "Mixed • Tagged • Saved",
        year: 2022,
        tags: ["random", "mixed", "saved"],
        description: "A misc dump of saved finds.",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/collagio-mix-1/1200/800",
      },
    ],
    []
  );

  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [activeId, setActiveId] = useState();
  const active = posts.find((p) => p.id === activeId) ?? posts[0];

  // Modal state
  const [open, setOpen] = useState(false);

  // Form state
  const currentYear = new Date().getFullYear();
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number>(currentYear);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Media state
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>("");

  const [formError, setFormError] = useState<string>("");

  function resetForm() {
    setTitle("");
    setYear(currentYear);
    setDescription("");
    setTagInput("");
    setTags([]);
    setFormError("");

    // cleanup preview url
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaFile(null);
    setMediaType("image");
    setMediaPreviewUrl("");
  }

  function addTag(raw: string) {
    const t = slugifyTag(raw);
    if (!t) return;
    setTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function closeModal() {
    setOpen(false);
    resetForm();
  }

  function handleMediaChange(file: File | null) {
    setFormError("");

    // cleanup old preview
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);

    if (!file) {
      setMediaFile(null);
      setMediaPreviewUrl("");
      return;
    }

    if (isSupportedImage(file)) {
      setMediaType("image");
    } else if (isSupportedAudio(file)) {
      setMediaType("audio");
    } else {
      setMediaFile(null);
      setMediaPreviewUrl("");
      setFormError("Unsupported file. Use .jpeg/.jpg/.png or .mp3/.wav.");
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreviewUrl(url);
  }

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setFormError("Please enter a post name.");
      return;
    }

    if (!mediaFile) {
      setFormError("Please upload a photo (jpeg/png) or audio (mp3/wav).");
      return;
    }

    const subtitleFromTags =
      tags.length > 0
        ? tags
            .slice(0, 3)
            .map((t) => t[0].toUpperCase() + t.slice(1))
            .join(" • ")
        : "Tagged Post";

    const newPost: Post = {
      id: `p_${crypto.randomUUID()}`,
      title: cleanTitle,
      subtitle: subtitleFromTags,
      year: Number.isFinite(year) ? year : currentYear,
      tags,
      description: description.trim(),
      mediaType,
      // local objectURL preview for now
      mediaUrl: mediaPreviewUrl,
    };

    setPosts((prev) => [newPost, ...prev]);
    // setActiveId(newPost.id);

    // IMPORTANT: do NOT revoke the URL here because the post is using it.
    // Later, when you upload to storage and replace mediaUrl with a real URL,
    // THEN you can revoke the old objectURL safely.

    // reset only the non-media fields but keep modal close
    setOpen(false);
    setTitle("");
    setYear(currentYear);
    setDescription("");
    setTagInput("");
    setTags([]);
    setFormError("");
    // keep media preview in post, but clear form state variables
    setMediaFile(null);
    setMediaType("image");
    setMediaPreviewUrl("");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Post cards */}
          <section className="flex flex-wrap">
            {posts.map(p => <>
              <button className="bg-card min-h-96 min-w-64 border hover:shadow-2xl hover:scale-125 transition-all duration-300 ease-out cursor-pointer hover:before:opacity-65 relative hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:w-full hover:before:h-full z-0 hover:z-50 hover:before:bg-black"
                style={{
                  backgroundImage: `url(${p.mediaUrl});`
                }}
                onClick={() => setActiveId(p.id)}
              >

              </button>
            </>)}
          </section>
          {activeId && <div className="fixed bg-black/55 backdrop-blur-lg z-100 top-0 left-0 w-screen h-screen">

            </div>}
        </div>
      </div>

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* backdrop */}
          <button
            aria-label="Close"
            className="absolute inset-0 bg-black/30"
            onClick={closeModal}
            type="button"
          />

          {/* dialog */}
          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Add New Post</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Upload media + add name, year, tags, and a description.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="mt-5 grid gap-4">
              {/* Media upload */}
              <div>
                <label className="text-sm font-medium">Media (photo or audio)</label>
                <p className="mt-1 text-xs text-zinc-500">
                  Photos: .jpeg/.jpg/.png • Audio: .mp3/.wav
                </p>

                <input
                  type="file"
                  accept=".jpeg,.jpg,.png,.mp3,.wav,image/jpeg,image/png,audio/mpeg,audio/wav"
                  onChange={(e) => handleMediaChange(e.target.files?.[0] ?? null)}
                  className="mt-2 block w-full text-sm text-zinc-700 file:mr-4 file:rounded-full file:border file:border-zinc-200 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-50"
                />

                {/* Media preview */}
                {mediaPreviewUrl ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                    {mediaType === "image" ? (
                      <img
                        src={mediaPreviewUrl}
                        alt="Upload preview"
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="p-4">
                        <div className="text-sm font-semibold text-zinc-700">🎧 Audio preview</div>
                        <audio className="mt-2 w-full" controls src={mediaPreviewUrl} />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium">Post name</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Hike"
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Year</label>
                <input
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  type="number"
                  min={1900}
                  max={3000}
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>

                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => removeTag(t)}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                      title="Click to remove"
                    >
                      #{t} <span className="text-zinc-400">×</span>
                    </button>
                  ))}
                </div>

                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                      setTagInput("");
                    }
                  }}
                  placeholder="Type a tag and press Enter (or comma)"
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a short description..."
                  className="mt-2 min-h-[110px] w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {formError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                className="h-11 rounded-xl bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Create Post
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
