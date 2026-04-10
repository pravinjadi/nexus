export type Platform =
  | "linkedin"
  | "x"
  | "instagram"
  | "youtube"
  | "github"
  | "tiktok"
  | "website"

export interface SocialLink {
  id: string
  platform: Platform
  url: string
  username: string
  order: number
}

export interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  username: string | null
  industry: string | null
  bio: string | null
  onboarded: boolean
  socialLinks: SocialLink[]
  _count?: {
    analytics: number
  }
}

export const PLATFORM_META: Record<
  Platform,
  { label: string; color: string; placeholder: string; baseUrl: string }
> = {
  linkedin:  { label: "LinkedIn",   color: "#0A66C2", placeholder: "linkedin.com/in/username",  baseUrl: "https://linkedin.com/in/" },
  x:         { label: "X",          color: "#000000", placeholder: "x.com/username",             baseUrl: "https://x.com/" },
  instagram: { label: "Instagram",  color: "#E1306C", placeholder: "instagram.com/username",     baseUrl: "https://instagram.com/" },
  youtube:   { label: "YouTube",    color: "#FF0000", placeholder: "youtube.com/@channel",       baseUrl: "https://youtube.com/@" },
  github:    { label: "GitHub",     color: "#333333", placeholder: "github.com/username",        baseUrl: "https://github.com/" },
  tiktok:    { label: "TikTok",     color: "#010101", placeholder: "tiktok.com/@username",       baseUrl: "https://tiktok.com/@" },
  website:   { label: "Website",    color: "#6366F1", placeholder: "yourwebsite.com",            baseUrl: "https://" },
}

export const INDUSTRIES = [
  "Technology", "Design", "Finance", "Marketing",
  "Creative", "Healthcare", "Education", "Legal",
  "Real Estate", "Other",
] as const

export type Industry = (typeof INDUSTRIES)[number]
