import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    localPatterns: [
      {
        pathname: "/api/uploads/**",
      },
      {
        pathname: "/images/**",
      },
      {
        pathname: "/hero.png",
      },
      {
        pathname: "/mobile-hero.png",
      },
      {
        pathname: "/homeabout.png",
      },
      {
        pathname: "/service*.png",
      },
      {
        pathname: "/home1.png",
      },
      {
        pathname: "/home2.png",
      },
      {
        pathname: "/home3.png",
      },
      {
        pathname: "/logo.png",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
