import type { Backend, FileUpload } from "../types";

import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getFileUploadChoice(fileUpload?: FileUpload, backend?: Backend) {
  if (fileUpload !== undefined) return fileUpload;

  // File upload requires a backend
  if (backend === "none" || backend === "convex") {
    return "none" as FileUpload;
  }

  const options = [
    {
      value: "uploadthing" as const,
      label: "UploadThing",
      hint: "TypeScript-first file uploads with built-in validation",
    },
    {
      value: "filepond" as const,
      label: "FilePond",
      hint: "Flexible file upload with image preview and drag & drop",
    },
    {
      value: "uppy" as const,
      label: "Uppy",
      hint: "Modular file uploader with resumable uploads and plugins",
    },
    {
      value: "none" as const,
      label: "None",
      hint: "Skip file upload integration",
    },
  ];

  const response = await navigableSelect<FileUpload>({
    message: "Select file upload solution",
    options,
    initialValue: "none",
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
