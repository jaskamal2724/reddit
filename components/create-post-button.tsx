"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface CreatePostButtonProps {
  communityId: string
}

export default function CreatePostButton({ communityId }: CreatePostButtonProps) {
  const params = useParams<{ slug: string }>()

  return (
    <Button asChild>
      <Link href={`/r/${params.slug}/submit`}>Create Post</Link>
    </Button>
  )
}
