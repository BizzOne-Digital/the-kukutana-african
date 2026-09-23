import Image, { ImageProps } from "next/image";
import { resolveImageUrl } from "@/lib/uploads/resolveImageUrl";

interface MuseumImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
}

export default function MuseumImage({ src, alt, className, ...props }: MuseumImageProps) {
  const resolved = resolveImageUrl(src);
  // Uploaded images are served by our own API route (not a static /public
  // file), which Next's image optimizer/Vercel can fail to fetch for
  // optimization. They're already served with long-lived immutable
  // caching, so optimization adds no value — skip it for these.
  const isStoredUpload = resolved.startsWith("/api/uploads/");

  return (
    <Image
      src={resolved}
      alt={alt}
      className={className}
      unoptimized={isStoredUpload}
      {...props}
    />
  );
}
