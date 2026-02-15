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
} from "lucide-react";
import UploadForm from "./uploadForm";

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

      const kind: UploaderValue["kind"] = file.type.startsWith("image/")
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
                {dz.fileStatuses.map((file) => {
                  const f = file as FileStatus<UploadResult, string>;
                  const isImg = f.file.type.startsWith("image/");
                  const previewUrl = f.status === "success" ? f.result.url : "";

                  return (
                    <DropzoneFileListItem key={file.id} file={file}>
                      <UploadForm
                        onCloseAction={() => {
                          document.getElementById("remove-file")?.click();
                        }}
                        previewUrl={previewUrl}
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
