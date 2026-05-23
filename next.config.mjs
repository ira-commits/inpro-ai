/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // LinkedIn profile pictures
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      // Supabase storage (avatars uploaded by users)
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Google profile pictures (for magic link users who have Google avatars)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
