import { formatDistanceToNow } from "date-fns"
import type { Post, User, Community, Comment, Vote } from "@prisma/client"
import VoteButtons from "@/components/vote-buttons"

interface CommentWithAuthor extends Comment {
  author: User
}

interface PostWithRelations extends Post {
  author: User
  community: Community
  votes: Vote[]
  comments: CommentWithAuthor[]
}

interface PostViewProps {
  post: PostWithRelations
}

export default function PostView({ post }: PostViewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
      <div className="flex">
        <div className="bg-gray-50 dark:bg-gray-900 p-2">
          <VoteButtons postId={post.id} votes={post.votes} />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium">r/{post.community.slug}</span>
            <span className="mx-1">•</span>
            <span>Posted by u/{post.author.username}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>
          <h1 className="text-xl font-semibold mb-4">{post.title}</h1>
          <div className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">{post.content}</div>
          {post.imageUrl && (
            <div className="mb-4">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="max-h-[500px] object-contain rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
