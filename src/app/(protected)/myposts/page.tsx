"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSettingsContext } from "~/hooks/useSettingsContext";
import { Button } from "~/components/ui/button";
import { ContentItem } from "~/components/content-item";
import UploadForm from "~/components/uploadForm";
import FileUploader from "~/components/fileuploader";
import { useState } from "react";
import { DropzoneFileListItem } from "~/components/ui/dropzone";

export default function MyPosts() {
  const { isDebug } = useSettingsContext();
  const posts = useQuery(api.post.get_post_for_user, {});
  const createPost = useMutation(api.post.create_post);

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "audio" | "unknown">(
    "unknown",
  );

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center">
      {isDebug && <pre>{JSON.stringify(posts, null, 2)}</pre>}
      {isDebug && (
        <>
          <Button
            onClick={() => {
              createPost({
                title: Math.random().toString(),
                description: "Randomized Post Description",
                setOfUserTags: [],
                contentUrl:
                  "https://images.unsplash.com/photo-1769097137026-c482044ca0fb?q=80&w=1295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              });
            }}
          >
            Add Randomized Post
          </Button>
        </>
      )}

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
            // Vary heights for masonry effect
            const heights = ["h-48", "h-56", "h-64", "h-72", "h-80", "h-96"];
            const heightClass = heights[(heights.length * Math.random()) >> 0];
            return (
              <div key={i} className={`mb-4 break-inside-avoid ${heightClass}`}>
                <ContentItem index={i} post={post} />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}