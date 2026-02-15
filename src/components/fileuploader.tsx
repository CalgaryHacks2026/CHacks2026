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
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold leading-none">
              Upload media
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Drag & drop, or choose a file.
            </p>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              dz.isInvalid
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground",
            )}
          >
            {dz.isInvalid ? (
              <>
                <AlertTriangleIcon className="h-4 w-4" />
                Needs attention
              </>
            ) : (
              <>
                <CloudUploadIcon className="h-4 w-4" />
                Ready
              </>
            )}
          </span>
        </div>

        <Dropzone {...dz}>
          <div className="mt-4 space-y-3">
            <DropZoneArea className="rounded-xl px-6 py-8">
              <div className="flex w-full flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-muted p-3">
                  <CloudUploadIcon className="h-6 w-6" />
                </div>

                <div>
                  <div className="text-sm font-medium">
                    Drop your file here
                  </div>
                  <DropzoneDescription className="mt-1">
                    or click below
                  </DropzoneDescription>
                </div>

                <div className="flex items-center gap-2">
                  <DropzoneTrigger className="rounded-xl">
                    Choose file
                  </DropzoneTrigger>

                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-xl"
                    onClick={() => {
                      const input =
                        document.querySelector<HTMLInputElement>(
                          `input[id="${dz.inputId}"]`,
                        ) ??
                        document.querySelector<HTMLInputElement>(
                          'input[type="file"]',
                        );
                      input?.click();
                    }}
                  >
                    Browse
                  </Button>
                </div>

                <DropzoneMessage className="mt-2" />
              </div>
            </DropZoneArea>

            {dz.fileStatuses.length > 0 && (
              <DropzoneFileList>
                {dz.fileStatuses.map((file) => (
                  <DropzoneFileListItem
                    key={file.id}
                    file={file as FileStatus<UploadResult, string>}
                    className="rounded-xl"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-lg bg-muted p-2">
                          <FileIcon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {file.fileName}
                          </div>
                          <div className="mt-1">
                            <StatusPill status={file.status} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.status === "error" && (
                          <DropzoneRetryFile title="Retry">
                            <RotateCwIcon className="h-4 w-4" />
                          </DropzoneRetryFile>
                        )}
                        <DropzoneRemoveFile title="Remove">
                          <Trash2Icon className="h-4 w-4" />
                        </DropzoneRemoveFile>
                      </div>
                    </div>

                    <DropzoneFileMessage />
                    <InfiniteProgress status={file.status} className="mt-2" />
                  </DropzoneFileListItem>
                ))}
              </DropzoneFileList>
            )}
          </div>
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
