import Image, { ImageProps } from "next/image";
import { resolveImageUrl } from "@/lib/uploads/resolveImageUrl";

interface MuseumImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
}

export default function MuseumImage({ src, alt, className, ...props }: MuseumImageProps) {
  const resolved = resolveImageUrl(src);
  return (
    <Image
      src={resolved}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
