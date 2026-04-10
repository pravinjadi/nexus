import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LoginPage from "@/components/layout/LoginPage"

export default async function Home() {
  const session = await auth()

  // Already logged in — route appropriately
  if (session?.user) {
    if (!session.user.onboarded) redirect("/onboarding")
    else redirect("/explore")
  }

  return <LoginPage />
}
