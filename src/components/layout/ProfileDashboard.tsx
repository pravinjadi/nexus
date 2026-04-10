"use client"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { PLATFORM_META, type Platform } from "@/types"

interface SocialLink { id: string; platform: string; url: string; username: string; order: number }
interface User {
  id: string; name: string | null; image: string | null; email: string | null
  username: string | null; industry: string | null; bio: string | null
  socialLinks: SocialLink[]; _count: { analytics: number }
}

export default function ProfileDashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<"links" | "analytics">("links")
  const [links, setLinks] = useState(user.socialLinks)
  const [showAdd, setShowAdd] = useState(false)
  const [newPlatform, setNewPlatform] = useState<Platform>("linkedin")
  const [newUrl, setNewUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const initials = (user.name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/explore/${user.username}`

  async function deleteLink(id: string) {
    await fetch(`/api/socials?id=${id}`, { method: "DELETE" })
    setLinks(prev => prev.filter(l => l.id !== id))
    toast.success("Link removed")
  }

  async function addLink() {
    if (!newUrl.trim()) { toast.error("Enter a URL"); return }
    setSaving(true)
    const meta = PLATFORM_META[newPlatform]
    const username = newUrl.replace(/^https?:\/\//, "").replace(meta.baseUrl.replace(/^https?:\/\//, ""), "").split("/")[0] || newUrl
    const res = await fetch("/api/socials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: newPlatform, url: newUrl.replace(/^https?:\/\//, ""), username }),
    })
    const link = await res.json()
    setLinks(prev => [...prev, link])
    setNewUrl(""); setShowAdd(false); setSaving(false)
    toast.success("Link added!")
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "20px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          {user.image ? (
            <img src={user.image} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }}/>
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#D4C5A9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: 20, color: "white", fontStyle: "italic" }}>
              {initials}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300 }}>{user.name}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.industry}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { navigator.clipboard.writeText(profileUrl); toast.success("Profile link copied!") }}
              style={smallBtn}
            >
              Share
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ ...smallBtn, color: "var(--text-muted)" }}>
              Sign out
            </button>
          </div>
        </div>

        {user.bio && <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12, paddingLeft: 66 }}>{user.bio}</p>}

        <div style={{ display: "flex", gap: 0 }}>
          {(["links", "analytics"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 16px", fontSize: 13, fontWeight: 500, border: "none", background: "none",
              cursor: "pointer", fontFamily: "var(--font-sans)",
              color: tab === t ? "var(--text)" : "var(--text-faint)",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {tab === "links" ? (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { num: user._count.analytics, lbl: "Scans" },
                { num: links.length, lbl: "Links" },
                { num: Math.max(0, user._count.analytics - 10), lbl: "This week" },
              ].map(({ num, lbl }) => (
                <div key={lbl} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 10px", textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 500 }}>{num}</p>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{lbl}</p>
                </div>
              ))}
            </div>

            {/* Link cards */}
            {links.map(link => {
              const meta = PLATFORM_META[link.platform as Platform]
              return (
                <div key={link.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta?.color ?? "#888", flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{meta?.label ?? link.platform}</p>
                    <p style={{ fontSize: 14, fontWeight: 500, marginTop: 1 }}>@{link.username}</p>
                  </div>
                  <button
                    onClick={() => deleteLink(link.id)}
                    style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-strong)", background: "var(--bg)", cursor: "pointer", fontSize: 14, color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ×
                  </button>
                </div>
              )
            })}

            {/* Add link */}
            {showAdd ? (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Add link</p>
                <select
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value as Platform)}
                  style={{ width: "100%", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "9px 12px", fontSize: 13, background: "var(--bg)", color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-sans)" }}
                >
                  {Object.entries(PLATFORM_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <input
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder={PLATFORM_META[newPlatform].placeholder}
                  style={{ width: "100%", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "9px 12px", fontSize: 13, background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-sans)", marginBottom: 10, outline: "none" }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 10, fontSize: 13, border: "1px solid var(--border-strong)", borderRadius: 100, background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
                  <button onClick={addLink} disabled={saving} style={{ flex: 2, padding: 10, fontSize: 13, border: "none", borderRadius: 100, background: "var(--accent)", color: "white", cursor: "pointer", fontFamily: "var(--font-sans)", opacity: saving ? 0.6 : 1 }}>
                    {saving ? "Saving…" : "Add link"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAdd(true)}
                style={{ width: "100%", padding: "12px", fontSize: 13, border: "1px dashed var(--border-strong)", borderRadius: "var(--radius)", background: "transparent", cursor: "pointer", color: "var(--text-muted)", fontFamily: "var(--font-sans)", marginTop: 4 }}
              >
                + Add social link
              </button>
            )}
          </>
        ) : (
          <AnalyticsTab links={links} totalScans={user._count.analytics} />
        )}
      </div>
    </div>
  )
}

function AnalyticsTab({ links, totalScans }: { links: SocialLink[]; totalScans: number }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const fakeData = [0.3, 0.6, 0.45, 0.8, 1, 0.7, 0.55]

  return (
    <>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginBottom: 12 }}>Card views this week</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 72 }}>
          {fakeData.map((h, i) => (
            <div key={i} style={{ flex: 1, background: "var(--bg)", borderRadius: 4, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ background: "var(--accent)", borderRadius: 4, height: `${h * 100}%`, opacity: 0.4 + h * 0.6, transition: "height 0.5s ease" }}/>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {days.map(d => <span key={d} style={{ fontSize: 10, color: "var(--text-faint)" }}>{d}</span>)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
          <p style={{ fontSize: 22, fontWeight: 500 }}>{totalScans}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>Total scans</p>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
          <p style={{ fontSize: 22, fontWeight: 500 }}>{links.length}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>Active links</p>
        </div>
      </div>

      <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>By platform</p>
      {links.map(link => {
        const meta = PLATFORM_META[link.platform as Platform]
        const pct = Math.floor(Math.random() * 60 + 20)
        return (
          <div key={link.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{meta?.label ?? link.platform}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: "var(--surface2)", borderRadius: 99 }}>
              <div style={{ height: "100%", background: meta?.color ?? "var(--accent)", borderRadius: 99, width: `${pct}%`, transition: "width 0.6s ease" }}/>
            </div>
          </div>
        )
      })}
    </>
  )
}

const smallBtn: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, border: "1px solid var(--border-strong)",
  borderRadius: 8, padding: "6px 12px", background: "var(--surface)",
  cursor: "pointer", color: "var(--text)", fontFamily: "var(--font-sans)",
}
