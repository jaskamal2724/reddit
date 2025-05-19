"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import type { Post, User, Community, Comment, Vote } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { createComment } from "@/lib/actions/comment-actions"

interface CommentWithAuthor extends Comment {
  author: User
}

interface PostWithRelations extends Post {
  author: User
  community: Community
  votes: Vote[]
  comments: CommentWithAuthor[]
}

interface CommentSectionProps {
  post: PostWithRelations
}

export default function CommentSection({ post }: CommentSectionProps) {
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [commentContent, setCommentContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSignedIn) {
      return router.push("/sign-in")
    }

    if (!commentContent.trim()) return

    setIsSubmitting(true)

    try {
      await createComment({
        postId: post.id,
        content: commentContent,
      })

      setCommentContent("")
      router.refresh()
    } catch (error) {
      console.error("Failed to create comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
      </h2>

      <form onSubmit={handleSubmitComment} className="mb-6">
        <Textarea
          placeholder={isSignedIn ? "What are your thoughts?" : "Please sign in to comment"}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={!isSignedIn || isSubmitting}
          className="mb-2"
        />
        <Button type="submit" disabled={!isSignedIn || isSubmitting || !commentContent.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-4">
        {post.comments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-medium">u/{comment.author.username}</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
            </div>
            <div className="text-gray-700 dark:text-gray-300">{comment.content}</div>
          </div>
        ))}

        {post.comments.length === 0 && (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  )
}
