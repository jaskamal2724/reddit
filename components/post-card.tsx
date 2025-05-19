import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import type { Post, User, Community, Vote } from "@prisma/client"
import VoteButtons from "@/components/vote-buttons"

interface PostWithRelations extends Post {
  author: User
  community: Community
  votes: Vote[]
  _count: {
    comments: number
  }
}

interface PostCardProps {
  post: PostWithRelations
}

export default function PostCard({ post }: PostCardProps) {
  const voteCount = post.votes.reduce((acc, vote) => {
    if (vote.type === "up") return acc + 1
    if (vote.type === "down") return acc - 1
    return acc
  }, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="flex">
        <div className="bg-gray-50 dark:bg-gray-900 p-2">
          <VoteButtons postId={post.id} votes={post.votes} />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <Link href={`/r/${post.community.slug}`} className="font-medium hover:underline">
              r/{post.community.slug}
            </Link>
            <span className="mx-1">•</span>
            <span>Posted by u/{post.author.username}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>
          <Link href={`/r/${post.community.slug}/post/${post.id}`}>
            <h2 className="text-lg font-semibold mb-2 hover:underline">{post.title}</h2>
          </Link>
          <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{post.content}</div>
          {post.imageUrl && (
            <div className="mb-3">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="max-h-96 object-contain rounded-md"
              />
            </div>
          )}
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Link
              href={`/r/${post.community.slug}/post/${post.id}`}
              className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
