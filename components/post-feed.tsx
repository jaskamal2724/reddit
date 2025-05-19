import { db } from "@/lib/db"
import PostCard from "@/components/post-card"

interface PostFeedProps {
  communityId?: string
  sortBy?: "latest" | "top"
}

export default async function PostFeed({ communityId, sortBy = "latest" }: PostFeedProps) {
  const orderBy = sortBy === "latest" ? { createdAt: "desc" as const } : { votes: { _count: "desc" as const } }

  const where = communityId ? { communityId } : {}

  const posts = await db.post.findMany({
    where,
    include: {
      author: true,
      community: true,
      votes: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy,
    take: 20,
  })

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
        <h3 className="text-lg font-medium">No posts yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to create a post in this community!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
