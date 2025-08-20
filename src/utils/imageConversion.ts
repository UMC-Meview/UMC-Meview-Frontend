import type { ProcessImageOptions } from '../types/imageConversion';

const DEFAULTS = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.8,
  sizeThreshold: 1_500_000,
};

function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

async function convertHeicWithLibrary(file: File): Promise<File> {
  try {
    const heicTo = await import("heic-to");
    const jpegBlob = await heicTo.heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.85
    });
    
    const baseName = file.name.replace(/\.(heic|heif)$/i, "");
    return new File([jpegBlob], `${baseName || "image"}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch (error) {
    console.error("HEIC 라이브러리 변환 실패:", error);
    throw error;
  }
}

async function convertHeicWithBrowser(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Failed to create blob")), "image/jpeg", 0.85);
    });

    const baseName = file.name.replace(/\.(heic|heif)$/i, "") || "image";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function convertHeicToJpegIfNeeded(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;

  try {
    return await convertHeicWithLibrary(file);
  } catch {
    return await convertHeicWithBrowser(file);
  }
}

async function compressImageWithCanvas(
  file: File, 
  maxWidth = DEFAULTS.maxWidth, 
  maxHeight = DEFAULTS.maxHeight, 
  quality = DEFAULTS.quality
): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

    const { naturalWidth: width, naturalHeight: height } = img;
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    const newWidth = Math.max(1, Math.round(width * scale));
    const newHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Failed to create blob")), "image/jpeg", quality);
    });

    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function compressToSize(file: File, maxBytes: number): Promise<File> {
  if (file.size <= maxBytes) return file;

  let quality = 0.9;
  let compressed = file;
  const maxDimension = DEFAULTS.maxWidth;

  while (compressed.size > maxBytes && quality > 0.1) {
    quality -= 0.1;
    compressed = await compressImageWithCanvas(file, maxDimension, maxDimension, quality);
  }

  return compressed;
}

/**
 * 업로드 전 이미지 전처리 - HEIC 변환, 리사이즈, 압축.
 */
export async function processImageForUpload(
  file: File,
  opts: ProcessImageOptions = {}
): Promise<File> {
  const { 
    sizeThreshold = DEFAULTS.sizeThreshold, 
    maxDimension = DEFAULTS.maxWidth, 
    quality = DEFAULTS.quality 
  } = opts;
  
  let processedFile = await convertHeicToJpegIfNeeded(file);
  
  if (processedFile.size > DEFAULTS.sizeThreshold || processedFile.type === "image/png") {
    processedFile = await compressImageWithCanvas(processedFile, maxDimension, maxDimension, quality);
  }
  
  if (sizeThreshold && processedFile.size > sizeThreshold) {
    processedFile = await compressToSize(processedFile, sizeThreshold);
  }

  return processedFile;
}
