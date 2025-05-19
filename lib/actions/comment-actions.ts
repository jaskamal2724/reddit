"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface CreateCommentParams {
  postId: string
  content: string
}

interface CreateCommentResult {
  success: boolean
  error?: string
}

export async function createComment(params: CreateCommentParams): Promise<CreateCommentResult> {
  const { userId } = auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to comment",
    }
  }

  const { postId, content } = params

  try {
    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { community: true },
    })

    if (!post) {
      return {
        success: false,
        error: "Post not found",
      }
    }

    // Create the comment
    await db.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    })

    revalidatePath(`/r/${post.community.slug}/post/${postId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to create comment:", error)
    return {
      success: false,
      error: "Failed to create comment",
    }
  }
}
