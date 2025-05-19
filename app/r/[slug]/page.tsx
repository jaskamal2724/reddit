import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import CommunityHeader from "@/components/community-header"
import PostFeed from "@/components/post-feed"
import CreatePostButton from "@/components/create-post-button"

interface CommunityPageProps {
  params: {
    slug: string
  }
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { slug } = params

  const community = await db.community.findUnique({
    where: { slug },
  })

  if (!community) {
    return notFound()
  }

  return (
    <div className="py-6">
      <CommunityHeader community={community} />
      <div className="flex justify-between items-center my-6">
        <h1 className="text-xl font-semibold">Posts</h1>
        <CreatePostButton communityId={community.id} />
      </div>
      <PostFeed communityId={community.id} />
    </div>
  )
}
