import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import CreatePostPageForm from "@/components/create-post-page-form"

export default async function CreatePostPage() {
//   const { userId } = auth()

//   if (!userId) {
//     redirect("/sign-in")
//   }

  // Fetch all communities for the dropdown
  const communities = await db.community.findMany({
    orderBy: {
      name: "asc",
    },
  })

//   if (communities.length === 0) {
//     // If no communities exist, redirect to create community page
//     redirect("/create-community")
//   }

  return (
    <div className="max-w-2xl mx-auto py-8">
        <CreatePostPageForm  />
    </div>
  )
}
