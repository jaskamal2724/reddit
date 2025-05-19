import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import PostView from "@/components/post-view"
import CommentSection from "@/components/comment-section"

interface PostPageProps {
  params: {
    slug: string
    postId: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, postId } = params

  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      community: true,
      votes: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!post || post.community.slug !== slug) {
    return notFound()
  }

  return (
    <div className="py-6">
      <PostView post={post} />
      <CommentSection post={post} />
    </div>
  )
}
