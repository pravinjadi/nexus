"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PLATFORM_META, type Platform } from "@/types"

interface SocialLink { id: string; platform: string; url: string; username: string; order: number }
interface User { id: string; name: string | null; image: string | null; username: string | null; industry: string | null; bio: string | null; socialLinks: SocialLink[] }

export default function CardViewerPage({ user }: { user: User }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const router = useRouter()
  const links = user.socialLinks
  const total = links.length
  const current = links[index]
  const initials = (user.name ?? "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
  const avatarColor = stringToColor(user.id)

  function go(dir: number) {
    setDirection(dir)
    setIndex(prev => {
      const next = prev + dir
      if (next < 0) return total - 1
      if (next >= total) return 0
      return next
    })
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 60) {
      go(info.offset.x < 0 ? 1 : -1)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText("https://" + current.url)
    toast.success("Link copied!")
  }

  const meta = PLATFORM_META[current?.platform as Platform]
  const platformColor = meta?.color ?? "#888"
  const fullUrl = "https://" + current?.url

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px 8px" }}>
        <button
          onClick={() => router.back()}
          style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border-strong)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 300 }}>{user.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.industry}</p>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/explore/${user.username}`); toast.success("Profile link copied!") }}
            style={{ fontSize: 12, fontWeight: 500, border: "1px solid var(--border-strong)", borderRadius: 8, padding: "6px 12px", background: "var(--surface)", cursor: "pointer", color: "var(--text)" }}
          >
            Share
          </button>
        </div>
      </div>

      {/* Card stack area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 20px", position: "relative" }}>
        {/* Background cards (depth illusion) */}
        {links.slice(index + 1, index + 3).map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: "calc(100% - 40px)", maxWidth: 380, height: 380,
            background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)",
            transform: `scale(${1 - (i + 1) * 0.04}) translateY(${-(i + 1) * 10}px)`,
            zIndex: 10 - i, opacity: 1 - (i * 0.15),
          }}/>
        ))}

        {/* Active card */}
        <AnimatePresence mode="popLayout" custom={direction}>
          {current && (
            <motion.div
              key={index}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ x: direction * 300, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: direction * -300, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "relative", zIndex: 20, width: "100%", maxWidth: 380,
                background: "var(--surface)", borderRadius: 24, border: "1px solid var(--border)",
                padding: "28px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center",
                cursor: "grab", userSelect: "none", touchAction: "none",
              }}
              whileDrag={{ cursor: "grabbing", scale: 1.02 }}
            >
              {/* Platform label */}
              <div style={{ alignSelf: "flex-start", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: platformColor }}/>
                {meta?.label ?? current.platform}
              </div>

              {/* Avatar */}
              {user.image ? (
                <img src={user.image} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}/>
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: 26, color: "white", fontStyle: "italic", marginBottom: 12 }}>
                  {initials}
                </div>
              )}

              <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 2 }}>{user.name}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>@{current.username}</p>

              {/* QR Code */}
              <div style={{ width: 120, height: 120, border: "1px solid var(--border)", borderRadius: 12, padding: 8, background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <QRCodeSVG
                  value={fullUrl}
                  size={104}
                  fgColor="#1A1917"
                  bgColor="#ffffff"
                  level="M"
                />
              </div>

              {/* Link row */}
              <button
                onClick={copyLink}
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: "var(--bg)",
                  border: "1px solid var(--border-strong)", borderRadius: 100, padding: "8px 16px",
                  width: "100%", cursor: "pointer", fontFamily: "var(--font-sans)",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {current.url}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text)", flexShrink: 0 }}>Copy</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe hints + counter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {total > 1 && (
            <>
              <button onClick={() => go(-1)} style={arrowBtn}>←</button>
              <span style={{ fontSize: 11, color: "var(--text-faint)" }}>swipe to browse</span>
              <button onClick={() => go(1)} style={arrowBtn}>→</button>
            </>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: "4px 12px" }}>
          {index + 1} / {total}
        </div>
      </div>

      {/* Platform dots */}
      {total > 1 && (
        <div style={{ position: "fixed", bottom: 72, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 30 }}>
          {links.map((_, i) => (
            <div key={i} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }} style={{
              width: i === index ? 20 : 6, height: 6, borderRadius: 99,
              background: i === index ? "var(--accent)" : "var(--border-strong)",
              cursor: "pointer", transition: "all 0.25s ease",
            }}/>
          ))}
        </div>
      )}
    </div>
  )
}

const arrowBtn: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer", fontSize: 14,
  color: "var(--text-faint)", padding: "4px 2px",
}

function stringToColor(str: string) {
  const colors = ["#7B9FD4","#C4A5D4","#D4A57B","#7BD4B0","#D47B9A","#7BA5D4","#D4C5A9","#A5C4A5"]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
