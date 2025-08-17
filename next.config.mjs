/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_OPENAI_TTS_MODEL: process.env.NEXT_PUBLIC_OPENAI_TTS_MODEL,
    NEXT_PUBLIC_OPENAI_TTS_VOICE: process.env.NEXT_PUBLIC_OPENAI_TTS_VOICE,
  },
}

export default nextConfig
