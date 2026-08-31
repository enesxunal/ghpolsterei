import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME,
  CONTACT_LIMITS,
} from "@/lib/contact/constants";
import { fieldMessages } from "@/lib/contact/validation";

function extensionOf(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? (parts.pop() ?? "") : "";
}

function isJpegOrWebp(file: File): boolean {
  const mime = file.type.toLowerCase();
  const ext = extensionOf(file.name);
  return (
    mime === "image/jpeg" ||
    mime === "image/jpg" ||
    mime === "image/webp" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "webp"
  );
}

function renameWithExt(name: string, ext: string): string {
  const base = name.replace(/\.[^.]+$/, "") || "foto";
  return `${base}${ext}`;
}

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

async function decodeBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    return await createImageBitmap(file);
  }
}

async function encodeCanvas(
  width: number,
  height: number,
  bitmap: ImageBitmap,
  quality: number,
): Promise<Blob> {
  const type = "image/jpeg";

  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("canvas");
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    return canvas.convertToBlob({ type, quality });
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("canvas");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
  if (!blob) {
    throw new Error("toBlob");
  }
  return blob;
}

async function recompressJpeg(file: File, quality: number): Promise<File> {
  const bitmap = await decodeBitmap(file);
  try {
    const blob = await encodeCanvas(bitmap.width, bitmap.height, bitmap, quality);
    if (blob.size > CONTACT_LIMITS.maxFileBytes) {
      throw new Error("too-large");
    }
    return new File([blob], renameWithExt(file.name, ".jpg"), {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}

export async function optimizeContactPhoto(file: File): Promise<File> {
  if (isJpegOrWebp(file) && file.size <= CONTACT_LIMITS.skipOptimizeUnderBytes) {
    return file;
  }

  const bitmap = await decodeBitmap(file);
  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale =
      longest > CONTACT_LIMITS.maxEdgePx ? CONTACT_LIMITS.maxEdgePx / longest : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    let quality: number = CONTACT_LIMITS.optimizeQuality;
    let blob = await encodeCanvas(width, height, bitmap, quality);

    while (blob.size > CONTACT_LIMITS.targetFileBytes && quality > 0.55) {
      quality -= 0.08;
      blob = await encodeCanvas(width, height, bitmap, quality);
    }

    if (blob.size > CONTACT_LIMITS.maxFileBytes) {
      throw new Error("too-large");
    }

    return new File([blob], renameWithExt(file.name, ".jpg"), {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}

export async function optimizeContactPhotos(files: File[]): Promise<File[]> {
  const optimized: File[] = [];

  for (const file of files) {
    const ext = extensionOf(file.name);
    const mimeOk = ALLOWED_IMAGE_MIME.has(file.type.toLowerCase());
    const extOk = ALLOWED_IMAGE_EXTENSIONS.has(ext);
    if (!mimeOk || !extOk) {
      throw new Error(fieldMessages.filesType);
    }
    if (file.size > CONTACT_LIMITS.maxRawFileBytes) {
      throw new Error(fieldMessages.filesSize);
    }

    try {
      optimized.push(await optimizeContactPhoto(file));
    } catch {
      throw new Error(fieldMessages.filesOptimize);
    }
    await yieldToMain();
  }

  let total = optimized.reduce((sum, file) => sum + file.size, 0);
  let quality = 0.64;
  let current = optimized;

  while (total > CONTACT_LIMITS.maxTotalUploadBytes && quality >= 0.42) {
    const next: File[] = [];
    for (const file of current) {
      try {
        next.push(await recompressJpeg(file, quality));
      } catch {
        throw new Error(fieldMessages.filesOptimize);
      }
      await yieldToMain();
    }
    current = next;
    total = current.reduce((sum, file) => sum + file.size, 0);
    quality -= 0.08;
  }

  if (total > CONTACT_LIMITS.maxTotalUploadBytes) {
    throw new Error(fieldMessages.filesTotal);
  }

  return current;
}

export function formatPhotoReadyLabel(count: number, bytes: number): string {
  const mb = (bytes / (1024 * 1024)).toFixed(1).replace(".", ",");
  const noun = count === 1 ? "Foto bereit" : "Fotos bereit";
  return `${count} ${noun} · ${mb} MB`;
}
