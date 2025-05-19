import type { Post, User, Community, Comment, Vote } from "@prisma/client"

export interface CommentWithAuthor extends Comment {
  author: User
}

export interface PostWithRelations extends Post {
  author: User
  community: Community
  votes: Vote[]
  comments: CommentWithAuthor[]
  _count?: {
    comments: number
  }
}

export interface CommunityWithCount extends Community {
  _count: {
    posts: number
  }
}

export type VoteType = "up" | "down" | "none"
