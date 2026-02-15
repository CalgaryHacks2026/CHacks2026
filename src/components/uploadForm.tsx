"use client";

import * as React from "react";
import Fuse from "fuse.js";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";
import { SparklesIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "./ui/combobox";

export default function UploadForm({
  onCloseAction,
  previewUrl,
}: {
  onCloseAction?: () => void;
  previewUrl: string;
}) {
  const createTag = useMutation(api.tag.create_tag);
  const availableTags = useQuery(api.tag.get_tags);

  const [postName, setPostName] = React.useState("");
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [description, setDescription] = React.useState("");

  // AI-generated tags (will be populated by AI server call in useEffect)
  const [aiTags, setAiTags] = React.useState<string[]>([
    "ice cream",
    "red bull",
    "tesla",
    "germany",
  ]);

  // Extract tag names from availableTags
  const availableTagNames = React.useMemo(
    () => availableTags?.map((t) => t.name) ?? [],
    [availableTags]
  );

  // Fuse.js fuzzy search instance
  const fuse = React.useMemo(
    () =>
      new Fuse(availableTagNames, {
        threshold: 0.4,
        includeScore: true,
      }),
    [availableTagNames]
  );

  // Filtered tags based on fuzzy search
  const filteredTagNames = React.useMemo(() => {
    const trimmedInput = tagInput.trim().toLowerCase();
    if (!trimmedInput) return availableTagNames;

    const results = fuse.search(trimmedInput);
    return results.map((result) => result.item);
  }, [tagInput, fuse, availableTagNames]);

  const handleTagsChange = async (newTags: string[]) => {
    // Filter out AI tags from newTags - they're managed separately
    const userTags = newTags.filter((tag) => !aiTags.includes(tag));

    // Find any new tags that don't exist in the database
    for (const tag of userTags) {
      const trimmed = tag.trim();
      // Skip empty or whitespace-only tags
      if (!trimmed) continue;

      if (!availableTagNames.includes(tag)) {
        // Create the tag in the database
        await createTag({ name: tag });
      }
    }
    // Filter out any empty/whitespace-only tags and tags that are already AI tags
    setTags(
      userTags.filter(
        (tag) => tag.trim().length > 0 && !aiTags.includes(tag.trim().toLowerCase())
      )
    );
  };

  const handleCreateTag = async () => {
    const trimmed = tagInput.trim().toLowerCase();
    // Don't create empty or whitespace-only tags
    if (!trimmed || trimmed.length === 0) return;

    // Don't add if it's already an AI tag
    if (aiTags.includes(trimmed)) {
      setTagInput("");
      return;
    }

    if (!tags.includes(trimmed)) {
      if (!availableTagNames.includes(trimmed)) {
        await createTag({ name: trimmed });
      }
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleAddTag = (tagText: string) => {
    const trimmed = tagText.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const handleSubmit = async () => {};

  return createPortal(
    <div className="bg-background/65 backdrop-blur-md fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center">
      <Button
        onClick={onCloseAction}
        size="icon-lg"
        className="absolute top-4 right-4"
        variant="ghost"
      >
        <XIcon />
      </Button>
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-3xl border bg-card p-8 shadow-lg overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Upload a Memora</h2>
            </div>
          </div>

          <Image
            alt="preview"
            width={300}
            height={300}
            src={previewUrl}
            className="w-full rounded-xl my-4"
          />

          <div className="space-y-6">
            {/* Post Name */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-lg font-semibold"
              >
                Title
              </label>
              <Input
                id="title"
                type="text"
                value={postName}
                onChange={(e) => setPostName(e.target.value)}
                placeholder="e.g. Summer Hike"
                className="h-12 text-base focus:border-blue-400"
              />
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-lg font-semibold"
              >
                Year
              </label>
              <Input
                id="year"
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
              <label
                htmlFor="tags"
                className="mb-2 block text-lg font-semibold"
              >
                Tags
              </label>
              <Combobox
                multiple
                value={tags}
                onValueChange={handleTagsChange}
                inputValue={tagInput}
                onInputValueChange={setTagInput}
              >
                <ComboboxChips>
                  <ComboboxValue>
                    {/* AI-generated tags - non-removable with special styling */}
                    {aiTags.map((item) => (
                      <span
                        key={`ai-${item}`}
                        className="flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1.5 rounded-sm px-2 text-xs font-medium whitespace-nowrap bg-linear-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-200"
                      >
                        <SparklesIcon className="size-3" />
                        {item}
                      </span>
                    ))}
                    {/* User-added tags - removable */}
                    {tags.map((item) => (
                      <ComboboxChip key={item}>{item}</ComboboxChip>
                    ))}
                  </ComboboxValue>
                  <ComboboxChipsInput
                    placeholder="Select tags"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        tagInput.trim().length > 0 &&
                        filteredTagNames.length === 0
                      ) {
                        e.preventDefault();
                        handleCreateTag();
                      }
                    }}
                  />
                </ComboboxChips>
                <ComboboxContent>
                  {tagInput.trim().length > 0 && (
                    <ComboboxEmpty
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={handleCreateTag}
                    >
                      Add &quot;{tagInput.trim().toLowerCase()}&quot; as a tag
                    </ComboboxEmpty>
                  )}
                  <ComboboxList>
                    {filteredTagNames.map((item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-lg font-semibold">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description..."
                rows={5}
              />
            </div>

            <Button size="lg" className="w-full">
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>,

    document.body,
  );
}
