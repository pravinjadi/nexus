"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: 64 }}>
        {children}
      </main>
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "var(--surface)",
        borderTop: "1px solid var(--border)", display: "flex", zIndex: 50,
      }}>
        <NavBtn href="/explore"   active={path.startsWith("/explore")}  label="Explore"  icon={<SearchIcon />} />
        <NavBtn href="/profile"   active={path.startsWith("/profile")}  label="Profile"  icon={<PersonIcon />} />
      </nav>
    </div>
  )
}

function NavBtn({ href, active, label, icon }: { href: string; active: boolean; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      padding: "10px 0 14px", textDecoration: "none",
      color: active ? "var(--text)" : "var(--text-faint)",
      fontSize: 10, fontWeight: 500, letterSpacing: "0.03em",
      transition: "color 0.15s",
    }}>
      {icon}
      {label}
    </Link>
  )
}

function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
function PersonIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
}
