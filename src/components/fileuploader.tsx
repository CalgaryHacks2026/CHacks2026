"use client";

import * as React from "react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  DropzoneTrigger,
  InfiniteProgress,
  useDropzone,
  type FileStatus,
} from "~/components/ui/dropzone";

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

export type UploaderValue = {
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
        await new Promise((r) => setTimeout(r, 250)); // fake upload delay
        return { status: "success", result: { url } };
      } catch {
        return { status: "error", error: "Upload failed. Try again." };
      }
    },

    onAllUploaded: () => {
      const last = dz.fileStatuses[dz.fileStatuses.length - 1] as
        | FileStatus<UploadResult, string>
        | undefined;

      if (!last) return;

      const file = last.file;
      const url = last.status === "success" ? last.result.url : "";

      const kind: UploaderValue["kind"] =
        file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("audio/")
            ? "audio"
            : "unknown";

      props.onChange({ file, url, kind });
    },

    onRemoveFile: async () => {
      props.onChange({ file: null, url: "", kind: "unknown" });
    },
  });

  React.useEffect(() => {
    if (dz.fileStatuses.length === 0) {
      props.onChange({ file: null, url: "", kind: "unknown" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dz.fileStatuses.length]);

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 shadow-xl backdrop-blur">
        <div className="mb-3 text-sm font-medium text-zinc-200">
          Please select up to {maxFiles} {maxFiles === 1 ? "file" : "files"}
        </div>

        <Dropzone {...dz}>
          <DropZoneArea
            className={cn(
              "rounded-2xl border border-white/10 bg-zinc-950 px-5 py-8",
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
              "transition",
              dz.isDragActive && "bg-zinc-900/40",
              dz.isInvalid && "border-red-500/40",
            )}
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
                <DropzoneTrigger className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/15">
                  Choose files
                </DropzoneTrigger>
              </div>

              <DropzoneMessage className="mt-3 text-red-300" />
            </div>
          </DropZoneArea>

          {/* Thumbnails */}
          {dz.fileStatuses.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-zinc-200">
                Selected
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {dz.fileStatuses.map((file) => {
                  const f = file as FileStatus<UploadResult, string>;
                  const isImg = f.file.type.startsWith("image/");
                  const previewUrl =
                    f.status === "success" ? f.result.url : "";

                  return (
                    <div
                      key={f.id}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <div className="aspect-square w-full">
                        {isImg && previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={f.fileName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FileIcon className="h-6 w-6 text-zinc-300" />
                          </div>
                        )}
                      </div>

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

                      <div className="px-2 pb-2 pt-2">
                        <div className="flex items-center justify-between">
                          <StatusPill status={f.status} />
                        </div>
                        <InfiniteProgress status={f.status} className="mt-2" />
                      </div>
                    </div>
                  );
                })}
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
