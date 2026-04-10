import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppShell from "@/components/layout/AppShell"

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/")
  if (!session.user.onboarded) redirect("/onboarding")
  return <AppShell>{children}</AppShell>
}
