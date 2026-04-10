import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const allowed = ["username", "industry", "bio", "onboarded", "name"]
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, username: true, industry: true, bio: true, onboarded: true },
  })
  return NextResponse.json(user)
}
