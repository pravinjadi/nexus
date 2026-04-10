"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { UserProfile } from "@/types"
import { PLATFORM_META } from "@/types"

export default function ExplorePage() {
  const [people, setPeople] = useState<UserProfile[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchPeople = useCallback(async (q = "") => {
    setLoading(true)
    const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setPeople(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPeople() }, [fetchPeople])

  useEffect(() => {
    const t = setTimeout(() => fetchPeople(query), 300)
    return () => clearTimeout(t)
  }, [query, fetchPeople])

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", padding: "20px 20px 0", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 300, marginBottom: 12 }}>Explore</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg)", border: "1px solid var(--border-strong)", borderRadius: 100, padding: "9px 16px", marginBottom: 12 }}>
          <SearchIcon />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search people, industries, handles…"
            style={{ border: "none", background: "none", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text)", outline: "none", flex: 1 }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", fontSize: 16, lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : people.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, padding: "60px 0" }}>
            {query ? `No profiles match "${query}"` : "No profiles yet — be the first!"}
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              {query ? `${people.length} result${people.length !== 1 ? "s" : ""}` : "All profiles"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {people.map(person => (
                <PersonTile key={person.id} person={person} onClick={() => router.push(`/explore/${person.username}`)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function PersonTile({ person, onClick }: { person: UserProfile; onClick: () => void }) {
  const initials = (person.name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const color = stringToColor(person.id)

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
        padding: 14, cursor: "pointer", transition: "all 0.18s ease",
      }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--border-strong)" }}
      onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border)" }}
    >
      {person.image ? (
        <img src={person.image} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }}/>
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: 17, color: "white", fontStyle: "italic", marginBottom: 10 }}>
          {initials}
        </div>
      )}
      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{person.name}</p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{person.industry}</p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {person.socialLinks.slice(0, 4).map(link => (
          <div key={link.id} style={{
            width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
            background: (PLATFORM_META[link.platform as keyof typeof PLATFORM_META]?.color ?? "#888") + "18",
          }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: PLATFORM_META[link.platform as keyof typeof PLATFORM_META]?.color ?? "#888" }}>
              {link.platform.slice(0,2).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface2)", marginBottom: 10 }}/>
      <div style={{ height: 12, width: "70%", background: "var(--surface2)", borderRadius: 4, marginBottom: 6 }}/>
      <div style={{ height: 10, width: "45%", background: "var(--surface2)", borderRadius: 4, marginBottom: 10 }}/>
      <div style={{ display: "flex", gap: 4 }}>
        {[1,2,3].map(i => <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: "var(--surface2)" }}/>)}
      </div>
    </div>
  )
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-faint)", flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}

function stringToColor(str: string) {
  const colors = ["#7B9FD4","#C4A5D4","#D4A57B","#7BD4B0","#D47B9A","#7BA5D4","#D4C5A9","#A5C4A5"]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
