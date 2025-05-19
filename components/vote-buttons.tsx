"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Vote } from "@prisma/client"
import { voteOnPost } from "@/lib/actions/vote-actions"

interface VoteButtonsProps {
  postId: string
  votes: Vote[]
}

export default function VoteButtons({ postId, votes }: VoteButtonsProps) {
  const { user } = useUser()
  const router = useRouter()

  const voteCount = votes.reduce((acc, vote) => {
    if (vote.type === "up") return acc + 1
    if (vote.type === "down") return acc - 1
    return acc
  }, 0)

  const currentVote = user ? votes.find((vote) => vote.userId === user.id) : null
  const [optimisticVote, setOptimisticVote] = useState<"up" | "down" | null>(
    currentVote ? (currentVote.type as "up" | "down") : null,
  )
  const [optimisticCount, setOptimisticCount] = useState(voteCount)

  const handleVote = async (type: "up" | "down") => {
    if (!user) {
      return router.push("/sign-in")
    }

    // Optimistic update
    const previousVote = optimisticVote

    if (optimisticVote === type) {
      // Removing vote
      setOptimisticVote(null)
      setOptimisticCount((prev) => (type === "up" ? prev - 1 : prev + 1))
    } else {
      // Adding or changing vote
      setOptimisticVote(type)
      setOptimisticCount((prev) => {
        if (previousVote === null) {
          return type === "up" ? prev + 1 : prev - 1
        } else {
          return type === "up" ? prev + 2 : prev - 2
        }
      })
    }

    try {
      await voteOnPost({
        postId,
        voteType: optimisticVote === type ? "none" : type,
      })
      router.refresh()
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticVote(previousVote)
      setOptimisticCount(voteCount)
      console.error("Failed to vote:", error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote("up")}
        className={cn(
          "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",
          optimisticVote === "up" && "text-orange-500",
        )}
        aria-label="Upvote"
      >
        <ArrowBigUp className="h-6 w-6" />
      </button>
      <span className="text-xs font-medium">{optimisticCount}</span>
      <button
        onClick={() => handleVote("down")}
        className={cn(
          "p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700",
          optimisticVote === "down" && "text-blue-500",
        )}
        aria-label="Downvote"
      >
        <ArrowBigDown className="h-6 w-6" />
      </button>
    </div>
  )
}
