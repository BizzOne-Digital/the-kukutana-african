"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import MuseumImage from "@/components/ui/MuseumImage";

type Folder = "products" | "gallery" | "pages" | "misc";

interface LocalImageFieldProps {
  value?: string;
  onChange: (url: string) => void;
  folder: Folder;
  label?: string;
  recommendedSize?: string;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";

export default function LocalImageField({
  value,
  onChange,
  folder,
  label,
  recommendedSize,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess(false);

    if (file.size > 8 * 1024 * 1024) {
      setError("File exceeds 8MB limit.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Upload failed.");
        return;
      }

      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <p className="text-xs uppercase tracking-wider text-cream/70 mb-2">{label}</p>}

      <div className="flex items-start gap-4">
        <div className="relative w-28 h-28 shrink-0 rounded-sm overflow-hidden border border-gold/20 bg-background-brown/50">
          {value ? (
            <MuseumImage src={value} alt={label || "Uploaded image"} fill sizes="112px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-xs">No image</div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background-dark/70 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-gold-light" />
            </div>
          )}
        </div>

        <div className="flex-1">
          {recommendedSize && <p className="text-[11px] text-muted mb-2">Recommended: {recommendedSize}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider border border-gold/40 text-cream hover:bg-gold-light/10 rounded-sm disabled:opacity-50"
            >
              <Upload size={14} />
              {value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider border border-red-400/30 text-red-300 hover:bg-red-400/10 rounded-sm"
              >
                <X size={14} />
                Remove
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileSelect}
            className="hidden"
          />

          {success && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
              <CheckCircle2 size={14} /> Uploaded successfully
            </p>
          )}
          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={14} /> {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
