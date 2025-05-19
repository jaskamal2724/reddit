"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface CreateCommunityParams {
  name: string
  slug: string
}

interface CreateCommunityResult {
  success: boolean
  error?: string
}

export async function createCommunity(params: CreateCommunityParams): Promise<CreateCommunityResult> {
  const { userId } = auth()

  if (!userId) {
    return {
      success: false,
      error: "You must be logged in to create a community",
    }
  }

  const { name, slug } = params

  try {
    // Check if community with this slug already exists
    const existingCommunity = await db.community.findUnique({
      where: { slug },
    })

    if (existingCommunity) {
      return {
        success: false,
        error: "A community with this name already exists",
      }
    }

    // Create the community
    await db.community.create({
      data: {
        name,
        slug,
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create community:", error)
    return {
      success: false,
      error: "Failed to create community",
    }
  }
}
