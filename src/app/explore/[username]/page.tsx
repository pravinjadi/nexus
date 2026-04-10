import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CardViewerPage from "@/components/cards/CardViewerPage"

// 1. Change: Update the type definition so params is a Promise
export default async function ProfileCardPage({ params }: { params: Promise<{ username: string }> }) {  
  // 2. Change: Await the params before accessing the username
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username: username }, // Use the awaited username here
    select: {
      id: true, 
      name: true, 
      image: true, 
      username: true, 
      industry: true, 
      bio: true,
      socialLinks: { orderBy: { order: "asc" } },
    },
  })

  if (!user || !user.username) notFound()

  return <CardViewerPage user={user} />
}