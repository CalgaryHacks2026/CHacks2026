"use client";

import * as React from "react";
import FileUploader from "./fileuploader";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Add New Post</h1>
            <p className="mt-1 text-lg text-zinc-600">
              Upload media + add name, year, tags, and a description.
            </p>
          </div>

          {onCloseAction && (
            <button
              type="button"
              onClick={onCloseAction}
              className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Close
            </button>
          )}
        </div>

        {/* ✅ either remove this, or close it properly */}
        <p className="mb-8 text-lg text-zinc-600">
          {/* optional helper text here, or just leave it empty */}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media Upload */}
          <div>
            <label className="mb-2 block text-lg font-semibold text-zinc-900">
              Media (photo or audio)
            </label>
            <p className="mb-4 text-sm text-zinc-600">
              Photos: .jpeg/.jpg/.png • Audio: .mp3/.wav
            </p>
          </div>

          {/* Post Name */}
          <div>
            <label className="mb-2 block text-lg font-semibold text-zinc-900">
              Post name
            </label>
            <Input
              type="text"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              placeholder="e.g. Summer Hike"
              className="h-12 border-zinc-200 bg-white text-base focus:border-blue-400"
            />
          </div>

          {/* Year */}
          <div>
            <label className="mb-2 block text-lg font-semibold text-zinc-900">
              Year
            </label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={1900}
              max={3000}
              className="h-12 border-zinc-200 bg-white text-base focus:border-blue-400"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-lg font-semibold text-zinc-900">
              Tags
            </label>

            {tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-200"
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
              className="h-12 border-zinc-200 bg-white text-base focus:border-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-lg font-semibold text-zinc-900">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="min-h-[140px] w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
  );
}
