"use client";

import * as React from "react";
import FileUploader from "./fileuploader";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";

type UploaderValue = {
  file: File | null;
  url: string;
  kind: "image" | "audio" | "unknown";
};

export default function UploadForm({
  onCloseAction,
}: {
  onCloseAction?: () => void;
}) {
  const [postName, setPostName] = React.useState("");
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleAddTag = (tagText: string) => {
    const trimmed = tagText.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // await onSubmit({
    //   mediaFile,
    //   mediaUrl,
    //   mediaType,
    //   postName,
    //   year,
    //   tags,
    //   description,
    // });
  };

  return createPortal(
    <div className="bg-background/65 backdrop-blur-md fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center">
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-3xl border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Add New Post</h1>
            <p className="mt-1 text-lg">
              Upload media + add name, year, tags, and a description.
            </p>
          </div>
        </div>

        {/* ✅ either remove this, or close it properly */}
        <p className="mb-8 text-lg">
          {/* optional helper text here, or just leave it empty */}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <div>
            <label className="mb-2 block text-lg font-semibold">
              Media (photo or audio)
            </label>
            <p className="mb-4 text-sm text-zinc-300">
              Photos: .jpeg/.jpg/.png • Audio: .mp3/.wav
            </p>
          </div>

          {/* Post Name */}
          <div>
            <label className="mb-2 block text-lg font-semibold">
              Post name
            </label>
            <Input
              type="text"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              placeholder="e.g. Summer Hike"
              className="h-12 text-base focus:border-blue-400"
            />
          </div>

          {/* Year */}
          <div>
            <label className="mb-2 block text-lg font-semibold">
              Year
            </label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={1900}
              max={3000}
              className="h-12 text-base focus:border-blue-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-lg font-semibold">
              Tags
            </label>

            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition"
                    title="Click to remove"
                  >
                    #{tag} <span className="text-xs">×</span>
                  </button>
                ))}
              </div>
            )}

            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter (or comma)"
              className="h-12 text-base focus:border-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-lg font-semibold">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="min-h-[140px] w-full resize-none rounded-xl border px-4 py-3 text-base outline-none transition focus:ring-4 "
            />
          </div>

          {/*{error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}*/}

          {/*<button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-full bg-gradient-to-r from-blue-600 via-pink-600 to-emerald-600 px-6 text-lg font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Creating..." : submitButtonText}
        </button>*/}
        </form>
      </div>
      </div>
    </div>,

    document.body
  );
}
