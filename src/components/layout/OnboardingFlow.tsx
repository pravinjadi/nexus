"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { INDUSTRIES, PLATFORM_META, type Platform } from "@/types"

const PLATFORMS = Object.entries(PLATFORM_META) as [Platform, typeof PLATFORM_META[Platform]][]

interface Props { user: { id?: string; name?: string | null; image?: string | null } }

export default function OnboardingFlow({ user }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [industry, setIndustry] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [links, setLinks] = useState<Record<string, string>>(
    Object.fromEntries(PLATFORMS.map(([k]) => [k, ""]))
  )
  const [loading, setLoading] = useState(false)

  async function handleFinish() {
    if (!industry) { toast.error("Please select your industry"); return }
    if (!username.trim()) { toast.error("Please enter a username"); return }
    setLoading(true)
    try {
      // 1. Update profile
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), industry, bio, onboarded: true }),
      })
      // 2. Save social links
      const filled = PLATFORMS.filter(([k]) => links[k]?.trim())
      await Promise.all(
        filled.map(([platform, meta]) =>
          fetch("/api/socials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform,
              url: links[platform].trim(),
              username: links[platform].trim().replace(meta.baseUrl, "").split("/")[0],
            }),
          })
        )
      )
      router.push("/explore")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", flexDirection: "column" }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--border)", position: "relative" }}>
        <div style={{
          height: "100%", background: "var(--accent)", borderRadius: 99,
          width: step === 1 ? "50%" : "100%", transition: "width 0.4s ease"
        }}/>
      </div>

      <div style={{ flex: 1, overflowY: "auto", maxWidth: 480, margin: "0 auto", width: "100%", padding: "32px 24px" }}>
        {step === 1 ? (
          <>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 300, marginBottom: 6 }}>
              Welcome{user.name ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>
              Tell us about yourself — takes 30 seconds
            </p>

            <Label>Your username</Label>
            <input
              style={inputStyle}
              placeholder="e.g. panda"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            />
            <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4, marginBottom: 20 }}>
              nexus.app/{username || "yourname"}
            </p>

            <Label>Industry</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  style={{
                    border: `1px solid ${industry === ind ? "var(--accent)" : "var(--border-strong)"}`,
                    borderRadius: "var(--radius-sm)", padding: "10px 12px", fontSize: 13,
                    cursor: "pointer", background: industry === ind ? "var(--accent)" : "var(--bg)",
                    color: industry === ind ? "white" : "var(--text-muted)",
                    fontFamily: "var(--font-sans)", transition: "all 0.15s",
                  }}
                >
                  {ind}
                </button>
              ))}
            </div>

            <Label>Short bio <span style={{ color: "var(--text-faint)" }}>(optional)</span></Label>
            <textarea
              style={{ ...inputStyle, height: 80, resize: "none" }}
              placeholder="e.g. Building products at the intersection of design and tech"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </>
        ) : (
          <>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 300, marginBottom: 6 }}>
              Your social links
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
              Add the platforms you want to share — at least one
            </p>
            {PLATFORMS.map(([key, meta]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: meta.color + "18", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: meta.color }}>{meta.label.slice(0,2).toUpperCase()}</span>
                </div>
                <input
                  style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                  placeholder={meta.placeholder}
                  value={links[key]}
                  onChange={e => setLinks(prev => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ padding: "16px 24px 28px", borderTop: "1px solid var(--border)", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        {step === 1 ? (
          <button style={primaryBtn} onClick={() => setStep(2)}>
            Continue
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ ...primaryBtn, background: "transparent", color: "var(--text)", border: "1px solid var(--border-strong)", flex: "0 0 auto", width: 44 }} onClick={() => setStep(1)}>
              ←
            </button>
            <button style={{ ...primaryBtn, flex: 1, opacity: loading ? 0.6 : 1 }} onClick={handleFinish} disabled={loading}>
              {loading ? "Saving…" : "Finish Setup"}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
      {children}
    </p>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)",
  padding: "10px 14px", fontFamily: "var(--font-sans)", fontSize: 14,
  background: "var(--bg)", color: "var(--text)", outline: "none", marginBottom: 16,
  display: "block",
}

const primaryBtn: React.CSSProperties = {
  width: "100%", background: "var(--accent)", color: "white", border: "none",
  borderRadius: 100, padding: 14, fontFamily: "var(--font-sans)", fontSize: 14,
  fontWeight: 500, cursor: "pointer", transition: "opacity 0.15s",
}
