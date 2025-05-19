import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import CreatePostForm from "@/components/create-post-form"

interface CreatePostPageProps {
  params: {
    slug: string
  }
}

export default async function CreatePostPage({ params }: CreatePostPageProps) {
  const { userId } = await auth()
  const { slug } = params

  if (!userId) {
    redirect("/sign-in")
  }

  const community = await db.community.findUnique({
    where: { slug },
  })

  if (!community) {
    return redirect("/")
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create a Post</h1>
      <CreatePostForm community={community} />
    </div>
  )
}
