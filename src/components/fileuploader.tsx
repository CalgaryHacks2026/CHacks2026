"use client";

import * as React from "react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
  type FileStatus,
} from "~/components/ui/dropzone";

import { cn } from "~/lib/utils";
import {
  CloudUploadIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  Loader2Icon,
} from "lucide-react";
import UploadForm from "./uploadForm";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

// Define a custom result type that includes storageId
type CustomUploadResult = { url: string; storageId: Id<"_storage"> };

export type UploaderValue = {
  file: File | null;
  url: string;
  kind: "image" | "audio" | "unknown";
  storageId: Id<"_storage"> | null; // Added storageId
};

export default function FileUploader(props: {
  accept?: "image-audio" | "image-pdf" | "any";
  maxFiles?: number;
  maxSizeMb?: number;
  onChange: (value: UploaderValue) => void;
}) {
  const accept = props.accept ?? "image-audio";
  const maxFiles = props.maxFiles ?? 1;
  const maxSize = (props.maxSizeMb ?? 10) * 1024 * 1024;

  // Get the mutation to generate upload URLs from Convex
  const generateUploadUrl = useMutation(api.post.generate_upload_url);

  const validationAccept = React.useMemo(() => {
    if (accept === "image-audio") {
      return {
        "image/jpeg": [],
        "image/png": [],
        "audio/mpeg": [],
        "audio/wav": [],
      } as const;
    }
    if (accept === "image-pdf") {
      return {
        "image/*": [],
        "application/pdf": [],
      } as const;
    }
    return undefined;
  }, [accept]);

  const dz = useDropzone<CustomUploadResult, string>({ // Use CustomUploadResult here
    validation: {
      accept: validationAccept as any,
      maxFiles,
      maxSize,
    },
    maxRetryCount: 3,
    autoRetry: false,
    shapeUploadError: (e) => e,

    onDropFile: async (file) => {
      try {
        // Step 1: Generate a short-lived upload URL from Convex
        const postUrl = await generateUploadUrl();

        // Step 2: Upload the file to the generated URL using fetch
        const uploadResponse = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        // Step 3: Parse the response to get the storageId
        const { storageId } = await uploadResponse.json() as { storageId: Id<"_storage"> };

        // Step 4: Create a preview URL and return both preview URL and storageId
        const previewUrl = URL.createObjectURL(file);
        return { status: "success", result: { url: previewUrl, storageId: storageId } };

      } catch (error: any) {
        console.error("Error in onDropFile:", error);
        return { status: "error", error: error.message || "Upload failed. Try again." };
      }
    },

    onAllUploaded: () => {
      // Ensure we are using the CustomUploadResult type for last.result
      const last = dz.fileStatuses[dz.fileStatuses.length - 1] as
        | FileStatus<CustomUploadResult, string>
        | undefined;

      if (!last) return;

      const file = last.file;
      const url = last.status === "success" && last.result ? last.result.url : "";
      const storageId = last.status === "success" && last.result ? last.result.storageId : null; // Get storageId

      const kind: UploaderValue["kind"] = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("audio/")
          ? "audio"
          : "unknown";

      // Pass the storageId to the onChange callback
      props.onChange({ file, url, kind, storageId });
    },

    onRemoveFile: async () => {
      // Clear storageId as well when removing the file
      props.onChange({ file: null, url: "", kind: "unknown", storageId: null });
    },
  });

  React.useEffect(() => {
    if (dz.fileStatuses.length === 0) {
      props.onChange({ file: null, url: "", kind: "unknown", storageId: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dz.fileStatuses.length]);

  return (
    <div className="w-full">
      <Dropzone {...dz}>
        <DropZoneArea
          className={cn(
            "rounded-2xl bg-slate-950 px-5 py-8",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
            "transition cursor-pointer hover:scale-105 hover:shadow-2xl",
            dz.isDragActive && "bg-zinc-900/40",
            dz.isInvalid && "border-red-500/40",
          )}
          onClick={() => {
            if (dz.fileStatuses.length === 0) {
              document.getElementById("dz-trigger")?.click();
            }
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <CloudUploadIcon className="h-6 w-6 text-zinc-200" />
            </div>

            <div className="text-lg font-semibold text-zinc-100">
              Upload media
            </div>

            <div className="mt-1 text-sm text-zinc-400">
              Click here or drag and drop to upload
            </div>

            <div className="mt-4">
              <DropzoneTrigger
                id="dz-trigger"
                className="hidden rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/15"
              >
                Choose files
              </DropzoneTrigger>
            </div>

            <DropzoneMessage className="mt-3 text-red-300" />
          </div>
          <DropzoneFileList>
            {dz.fileStatuses.length === 1 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {dz.fileStatuses.map((fileStatus) => {
                  // Cast to the correct type to access CustomUploadResult properties
                  const fileStatusWithResult = fileStatus as FileStatus<CustomUploadResult, string>;
                  const file = fileStatusWithResult.file;
                  // Safely access result properties only if status is success
                  const previewUrl = fileStatusWithResult.status === "success" && fileStatusWithResult.result ? fileStatusWithResult.result.url : "";
                  const storageId = fileStatusWithResult.status === "success" && fileStatusWithResult.result ? fileStatusWithResult.result.storageId : null;

                  return (
                    <DropzoneFileListItem key={fileStatus.id} file={fileStatus}>
                      <UploadForm
                        onCloseAction={() => {
                          document.getElementById("remove-file")?.click();
                        }}
                        previewUrl={previewUrl}
                        image={fileStatusWithResult.file}
                        storageId={storageId}
                      />
                      <DropzoneRemoveFile id="remove-file" className="hidden" />
                    </DropzoneFileListItem>
                  );
                })}
              </div>
            )}
          </DropzoneFileList>
        </DropZoneArea>
      </Dropzone>
    </div>
  );
}

function StatusPill(props: { status: "pending" | "success" | "error" }) {
  if (props.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-300/70" />
        Uploading
      </span>
    );
  }

  if (props.status === "success") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
        <CheckCircle2Icon className="h-3.5 w-3.5" />
        Uploaded
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] text-red-300">
      <AlertTriangleIcon className="h-3.5 w-3.5" />
      Failed
    </span>
  );
}
