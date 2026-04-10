import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CardViewerPage from "@/components/cards/CardViewerPage"

export default async function ProfileCardPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true, name: true, image: true, username: true, industry: true, bio: true,
      socialLinks: { orderBy: { order: "asc" } },
    },
  })
  if (!user || !user.username) notFound()
  return <CardViewerPage user={user} />
}
