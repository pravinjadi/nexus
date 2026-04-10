import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import OnboardingFlow from "@/components/layout/OnboardingFlow"

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user) redirect("/")
  if (session.user.onboarded) redirect("/explore")
  return <OnboardingFlow user={session.user} />
}
