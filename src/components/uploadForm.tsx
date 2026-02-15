"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
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
        <div className="rounded-3xl border bg-card p-8 shadow-lg">
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
              <Combobox multiple value={tags} onValueChange={setTags}>
                <ComboboxChips>
                  <ComboboxValue>
                    {tags.map((item) => (
                      <ComboboxChip key={item}>{item}</ComboboxChip>
                    ))}
                  </ComboboxValue>
                  <ComboboxChipsInput placeholder="Select tags" />
                </ComboboxChips>
                <ComboboxContent>
                  <ComboboxEmpty>
                    Add {} as a tag
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
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
