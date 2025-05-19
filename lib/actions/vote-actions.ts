"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface VoteOnPostParams {
  postId: string
  voteType: "up" | "down" | "none"
}

interface VoteOnPostResult {
  success: boolean
  error?: string
}

export async function voteOnPost(params: VoteOnPostParams): Promise<VoteOnPostResult> {
  const { userId } = auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to vote",
    }
  }

  const { postId, voteType } = params

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

    // Check if user has already voted
    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId,
      },
    })

    // If removing vote
    if (voteType === "none" && existingVote) {
      await db.vote.delete({
        where: {
          id: existingVote.id,
        },
      })
    }
    // If changing vote
    else if (existingVote) {
      await db.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          type: voteType,
        },
      })
    }
    // If new vote
    else if (voteType !== "none") {
      await db.vote.create({
        data: {
          type: voteType,
          postId,
          userId,
        },
      })
    }

    revalidatePath(`/r/${post.community.slug}/post/${postId}`)
    revalidatePath(`/r/${post.community.slug}`)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to vote on post:", error)
    return {
      success: false,
      error: "Failed to vote on post",
    }
  }
}
