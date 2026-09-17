export const ALLOWED_FOLDERS = new Set(["products", "gallery", "pages", "misc"]);

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB
