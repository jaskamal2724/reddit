import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import CreateCommunityForm from "@/components/create-community-form"

export default function CreateCommunityPage() {
  // const { userId } = auth()

  // if (!userId) {
  //   redirect("/sign-in")
  // }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 mt-20 text-black">Create a Community</h1>
      <CreateCommunityForm />
    </div>
  )
}
