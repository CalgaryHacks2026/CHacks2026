"use client";

import * as React from "react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  DropzoneTrigger,
  InfiniteProgress,
  useDropzone,
  type FileStatus,
} from "~/components/ui/dropzone";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  CloudUploadIcon,
  FileIcon,
  RotateCwIcon,
  Trash2Icon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react";

type UploadResult = { url: string };

type UploaderValue = {
  file: File | null;
  url: string;
  kind: "image" | "audio" | "unknown";
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

  const dz = useDropzone<UploadResult, string>({
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
        const url = URL.createObjectURL(file);
        await new Promise((r) => setTimeout(r, 400));
        return { status: "success", result: { url } };
      } catch {
        return { status: "error", error: "Upload failed. Try again." };
      }
    },

    onAllUploaded: () => {
      // We only care about the latest file if maxFiles=1
      const last = dz.fileStatuses[dz.fileStatuses.length - 1] as
        | FileStatus<UploadResult, string>
        | undefined;

      if (!last) return;

      const file = last.file;
      const url =
        last.status === "success" ? (last.result as UploadResult).url : "";

      const kind: UploaderValue["kind"] =
        file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("audio/")
            ? "audio"
            : "unknown";

      props.onChange({ file, url, kind });
    },

    onRemoveFile: async (_id) => {
      props.onChange({ file: null, url: "", kind: "unknown" });
    },
  });

  // If they remove via your “Remove” button per-file, also clear
  React.useEffect(() => {
    if (dz.fileStatuses.length === 0) {
      props.onChange({ file: null, url: "", kind: "unknown" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dz.fileStatuses.length]);

  return (
  <div className="w-full">
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 shadow-xl backdrop-blur">
      {/* Header like the screenshot */}
      <div className="mb-4 text-lg font-medium text-zinc-100">
        Please select up to {maxFiles} {maxFiles === 1 ? "file" : "images"}
      </div>

      <Dropzone {...dz}>
        <DropZoneArea
          className={cn(
            "rounded-2xl border border-white/10 bg-zinc-950 px-6 py-14",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
            "transition",
            dz.isDragActive && "bg-zinc-900/40",
            dz.isInvalid && "border-red-500/40",
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <CloudUploadIcon className="h-7 w-7 text-zinc-200" />
            </div>

            <div className="text-xl font-semibold text-zinc-100">
              Upload images
            </div>

            <div className="mt-1 text-sm text-zinc-400">
              Click here or drag and drop to upload
            </div>

            {/* Make the whole area clickable via Trigger */}
            <div className="mt-6">
              <DropzoneTrigger className="rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/15">
                Choose files
              </DropzoneTrigger>
            </div>

            <DropzoneMessage className="mt-3 text-red-300" />
          </div>
        </DropZoneArea>

        {/* PREVIEWS (the big missing piece vs your current UI) */}
        {dz.fileStatuses.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-sm font-medium text-zinc-200">
              Selected
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {dz.fileStatuses.map((file) => {
                const f = file as FileStatus<UploadResult, string>;
                const isImg = f.file.type.startsWith("image/");
                const url = f.status === "success" ? f.result?.url : "";

                return (
                  <div
                    key={f.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    {/* thumbnail */}
                    <div className="aspect-square w-full">
                      {isImg && url ? (
                        <img
                          src={url}
                          alt={f.fileName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileIcon className="h-6 w-6 text-zinc-300" />
                        </div>
                      )}
                    </div>

                    {/* status + actions */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/55 p-2">
                      <div className="min-w-0 truncate text-xs text-zinc-200">
                        {f.fileName}
                      </div>

                      <div className="flex items-center gap-1">
                        {f.status === "error" && (
                          <DropzoneRetryFile title="Retry">
                            <RotateCwIcon className="h-4 w-4 text-zinc-200" />
                          </DropzoneRetryFile>
                        )}
                        <DropzoneRemoveFile title="Remove">
                          <Trash2Icon className="h-4 w-4 text-zinc-200" />
                        </DropzoneRemoveFile>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* optional: keep your list + progress if you want */}
            <div className="mt-4 space-y-2">
              {dz.fileStatuses.map((file) => (
                <div key={file.id} className="text-xs text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{file.fileName}</span>
                    <StatusPill status={file.status} />
                  </div>
                  <InfiniteProgress status={file.status} className="mt-2" />
                  <DropzoneFileMessage />
                </div>
              ))}
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  </div>
);
}

function StatusPill(props: { status: "pending" | "success" | "error" }) {
  if (props.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/70" />
        Uploading
      </span>
    );
  }

  if (props.status === "success") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700">
        <CheckCircle2Icon className="h-3.5 w-3.5" />
        Uploaded
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] text-destructive">
      <AlertTriangleIcon className="h-3.5 w-3.5" />
      Failed
    </span>
  );
}
