import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/socials — current user's links
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const links = await prisma.socialLink.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(links)
}

// POST /api/socials — add a new link
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { platform, url: rawUrl, username: rawUsername } = await req.json()
  
  if (!platform || (!rawUrl && !rawUsername))
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  // --- START CLEANING LOGIC ---
  const platformConfigs: Record<string, { base: string; domain: string }> = {
    GITHUB: { base: "https://github.com/", domain: "github.com" },
    X: { base: "https://x.com/", domain: "x.com" },
    LINKEDIN: { base: "https://linkedin.com/in/", domain: "linkedin.com" },
    INSTAGRAM: { base: "https://instagram.com/", domain: "instagram.com" },
  }

  const config = platformConfigs[platform.toUpperCase()]
  
  // 1. Isolate a "clean" username from whatever was pasted (url or username field)
  const inputToProcess = rawUrl || rawUsername
  let cleanUsername = inputToProcess
    .trim()
    .replace(/^https?:\/\//, "")             // Remove http:// or https://
    .replace(/^(www\.)?/, "")                // Remove www.
    .replace(new RegExp(`^${config?.domain || ""}/(in/)?`), "") // Remove domain and possible /in/
    .split('/')[0]                           // Take only the first segment if trailing slashes exist
    .replace(/^@/, "");                      // Remove @ prefix

  // 2. Reconstruct valid data
  const finalUrl = config ? `${config.base}${cleanUsername}` : inputToProcess
  // --- END CLEANING LOGIC ---

  const count = await prisma.socialLink.count({ where: { userId: session.user.id } })

  const link = await prisma.socialLink.create({
    data: { 
      userId: session.user.id, 
      platform, 
      url: finalUrl,           // Always "https://platform.com/user"
      username: cleanUsername, // Always "user"
      order: count 
    },
  })
  
  return NextResponse.json(link, { status: 201 })
}

// PATCH /api/socials — update order or fields
export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, ...data } = await req.json()
  const link = await prisma.socialLink.updateMany({
    where: { id, userId: session.user.id },
    data,
  })
  return NextResponse.json(link)
}

// DELETE /api/socials?id=xxx
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.socialLink.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
