# Nexus — Social QR Card Sharing App

> Share all your social profiles through beautiful, swipeable QR cards.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | NextAuth v5 + Google OAuth |
| Database | PostgreSQL (Supabase / Neon) |
| ORM | Prisma |
| Styling | Tailwind CSS + CSS variables |
| Animations | Framer Motion |
| QR Codes | qrcode.react |
| Toasts | Sonner |
| Fonts | DM Sans + Fraunces (Google Fonts) |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/yourusername/nexus
cd nexus
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Supabase](https://supabase.com) or [Neon](https://neon.tech) — free tier |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | [Google Cloud Console](https://console.cloud.google.com) → Credentials → OAuth 2.0 |
| `AUTH_GOOGLE_SECRET` | Same as above |

**Google OAuth setup:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. For production, also add: `https://yourdomain.com/api/auth/callback/google`

### 3. Set up the database

```bash
# Push schema to your database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
nexus/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth catch-all route
│   │   │   ├── users/         # GET (explore list), PATCH me
│   │   │   └── socials/       # CRUD social links
│   │   ├── onboarding/        # Step 1-2 profile setup
│   │   ├── explore/
│   │   │   ├── page.tsx       # People grid + search
│   │   │   └── [username]/    # Card viewer for a profile
│   │   ├── profile/           # Logged-in user dashboard
│   │   ├── layout.tsx         # Root layout (fonts, Toaster)
│   │   ├── page.tsx           # Login / redirect
│   │   └── globals.css        # CSS custom properties
│   ├── components/
│   │   ├── layout/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── OnboardingFlow.tsx
│   │   │   ├── AppShell.tsx   # Bottom nav wrapper
│   │   │   ├── ExplorePage.tsx
│   │   │   └── ProfileDashboard.tsx
│   │   └── cards/
│   │       └── CardViewerPage.tsx  # Swipeable QR cards
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   └── prisma.ts          # Prisma singleton
│   └── types/
│       ├── index.ts           # Shared types + PLATFORM_META
│       └── next-auth.d.ts     # Session type extensions
```

---

## API Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | — | List all onboarded users (with `?q=` search) |
| PATCH | `/api/users/me` | ✓ | Update own profile fields |
| GET | `/api/socials` | ✓ | Get own social links |
| POST | `/api/socials` | ✓ | Add a social link |
| PATCH | `/api/socials` | ✓ | Update a social link |
| DELETE | `/api/socials?id=` | ✓ | Delete a social link |

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

In Vercel dashboard → Project Settings → Environment Variables, add all variables from `.env.local`.

Then in Google Cloud Console, add your production URL to the OAuth redirect URIs:
`https://your-project.vercel.app/api/auth/callback/google`

---

## Upcoming features (roadmap)

- [ ] Drag-to-reorder social links
- [ ] NFC "tap to share" profile link
- [ ] Real analytics (unique scans per card via `CardView` table)
- [ ] Dark mode toggle
- [ ] Custom profile themes per industry
- [ ] Mobile PWA (installable)
