import type { ValidatedFile } from "@/lib/contact/validation";

export type AttachmentPlan = {
  attachToEmail: boolean;
  files: ValidatedFile[];
  skippedNote: string | null;
};

/**
 * Processed uploads stay under 3.5 MB, so every validated file is attached.
 * No object storage — files exist only for this request.
 */
export function planEmailAttachments(files: ValidatedFile[]): AttachmentPlan {
  if (files.length === 0) {
    return { attachToEmail: false, files: [], skippedNote: null };
  }

  return { attachToEmail: true, files, skippedNote: null };
}
