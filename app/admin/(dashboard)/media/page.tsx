"use client";

import { useEffect, useState, useCallback, useRef, ChangeEvent } from "react";
import { Upload, Trash2 } from "lucide-react";
import MuseumImage from "@/components/ui/MuseumImage";

interface MediaItem {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

const FOLDERS = ["products", "gallery", "pages", "misc"] as const;

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [uploadFolder, setUploadFolder] = useState<(typeof FOLDERS)[number]>("misc");
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", uploadFolder);
    await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    load();
  }

  const filtered = folderFilter === "all" ? media : media.filter((m) => m.folder === folderFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-serif-heading text-ivory text-3xl">Media Library</h1>
        <div className="flex items-center gap-3">
          <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value as typeof uploadFolder)} className="bg-background-brown/50 border border-gold/20 rounded-sm px-3 py-2 text-sm text-cream">
            {FOLDERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider bg-gold text-text-dark hover:bg-gold-light rounded-sm disabled:opacity-50"
          >
            <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
          </button>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} className="hidden" />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", ...FOLDERS].map((f) => (
          <button
            key={f}
            onClick={() => setFolderFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-sm border ${folderFilter === f ? "bg-gold text-text-dark border-gold" : "border-gold/25 text-cream/70"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {!loading && filtered.length === 0 && <p className="text-muted">No media uploaded yet.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((item) => (
          <div key={item._id} className="relative group border border-gold/15 rounded-sm overflow-hidden aspect-square">
            <MuseumImage src={item.url} alt={item.filename} fill sizes="200px" className="object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button onClick={() => setConfirmDeleteId(item._id)} className="text-white">
                <Trash2 size={20} />
              </button>
            </div>
            <span className="absolute bottom-1 left-1 text-[9px] bg-background-dark/80 text-gold-light px-1.5 py-0.5 rounded-sm">
              {item.folder}
            </span>
          </div>
        ))}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background-brown border border-gold/25 rounded-sm p-6">
            <p className="text-cream mb-6">Delete this file? Any content referencing it will show a placeholder.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-xs uppercase tracking-wider border border-gold/30 text-cream rounded-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="px-4 py-2 text-xs uppercase tracking-wider bg-red-500/80 text-white rounded-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
