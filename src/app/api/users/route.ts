import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")?.trim() ?? ""

  const users = await prisma.user.findMany({
    where: {
      onboarded: true,
      ...(query
        ? {
            OR: [
              { name:     { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
              { industry: { contains: query, mode: "insensitive" } },
              { socialLinks: { some: { username: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    select: {
      id: true, name: true, image: true, username: true,
      industry: true, bio: true,
      socialLinks: { orderBy: { order: "asc" },
        select: { id: true, platform: true, url: true, username: true, order: true },
      },
      _count: { select: { analytics: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json(users)
}
