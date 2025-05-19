"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface CreatePostParams {
  title: string
  content: string
  imageUrl: string | null
  communityId: string
}

interface CreatePostResult {
  success: boolean
  error?: string
  postId?: string
}

export async function createPost(params: CreatePostParams): Promise<CreatePostResult> {
  const { userId } = auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to create a post",
    }
  }

  const { title, content, imageUrl, communityId } = params

  try {
    // Check if community exists
    const community = await db.community.findUnique({
      where: { id: communityId },
    })

    if (!community) {
      return {
        success: false,
        error: "Community not found",
      }
    }

    // Get user from Clerk
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Create the post
    const post = await db.post.create({
      data: {
        title,
        content,
        imageUrl,
        communityId,
        authorId: userId,
      },
    })

    revalidatePath(`/r/${community.slug}`)
    return {
      success: true,
      postId: post.id,
    }
  } catch (error) {
    console.error("Failed to create post:", error)
    return {
      success: false,
      error: "Failed to create post",
    }
  }
}
