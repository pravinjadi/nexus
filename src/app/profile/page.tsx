import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProfileDashboard from "@/components/layout/ProfileDashboard"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      socialLinks: { orderBy: { order: "asc" } },
      _count: { select: { analytics: true } },
    },
  })

  if (!user) redirect("/")
  return <ProfileDashboard user={user} />
}
