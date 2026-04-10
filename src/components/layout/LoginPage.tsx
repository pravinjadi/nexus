"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm flex flex-col items-center">
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 42, fontWeight: 300, letterSpacing: -1.5, marginBottom: 6 }}>
          Nexus
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 56, letterSpacing: "0.02em" }}>
          your social presence, one card at a time
        </p>

        {/* Illustration */}
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" style={{ marginBottom: 48 }}>
          <rect x="20" y="14" width="110" height="82" rx="13" fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
          <rect x="32" y="28" width="30" height="30" rx="15" fill="#D4C5A9"/>
          <rect x="70" y="34" width="48" height="6" rx="3" fill="#EDE9E2"/>
          <rect x="70" y="46" width="34" height="4" rx="2" fill="#F2EFE9"/>
          <rect x="32" y="66" width="88" height="20" rx="6" fill="#F5F3EF"/>
          <rect x="40" y="73" width="36" height="3" rx="1.5" fill="#D4C5A9"/>
          <rect x="40" y="79" width="52" height="2.5" rx="1.25" fill="#EDE9E2"/>
          <rect x="44" y="104" width="92" height="68" rx="13" fill="white" stroke="rgba(0,0,0,0.07)" strokeWidth="1" transform="rotate(-5 44 104)"/>
          <rect x="54" y="114" width="26" height="26" rx="13" fill="#B0A08A" transform="rotate(-5 54 114)"/>
          <rect x="88" y="120" width="38" height="5" rx="2.5" fill="#EDE9E2" transform="rotate(-5 88 120)"/>
          <rect x="88" y="130" width="28" height="4" rx="2" fill="#F2EFE9" transform="rotate(-5 88 130)"/>
        </svg>

        <button
          onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--surface)", border: "1px solid var(--border-strong)",
            borderRadius: 100, padding: "13px 28px", width: "100%",
            justifyContent: "center", fontSize: 14, fontWeight: 500,
            fontFamily: "var(--font-sans)", cursor: "pointer",
            color: "var(--text)", transition: "all 0.18s ease",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "var(--surface2)")}
          onMouseOut={e => (e.currentTarget.style.background = "var(--surface)")}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p style={{ marginTop: 20, fontSize: 11, color: "var(--text-faint)", textAlign: "center" }}>
          By continuing, you agree to Nexus Terms of Service
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
