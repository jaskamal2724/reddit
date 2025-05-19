import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowUp, ArrowDown, MessageSquare, Share, Bookmark, TrendingUp, Users, Calendar, Eye } from "lucide-react"

export default async function HomePage() {
  // Fetch top communities
  const topCommunities = await db.community.findMany({
    take: 5,
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  // Fetch recent posts for the main feed
  const recentPosts = await db.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      community: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  })

  // Fetch trending communities
  const trendingCommunities = await db.community.findMany({
    take: 3,
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    
    
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post Box */}
            <Card className="w-72">
              <CardContent className="p-4">
                <div className="flex  space-x-3">
                  <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <Button variant="outline" className="flex-1 justify-start" asChild>
                    <Link href="/create-post">Create Post</Link>
                  </Button>
                  <Button variant="outline" size="sm">Image</Button>
                  <Button variant="outline" size="sm">Link</Button>
                </div>
              </CardContent>
            </Card>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Hot
              </Button>
              <Button variant="ghost" size="sm">New</Button>
              <Button variant="ghost" size="sm">Top</Button>
              <Button variant="ghost" size="sm">Rising</Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800 w-12">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-medium py-1">{post._count.votes}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="flex-1 p-3">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <Link href={`/r/${post.community.slug}`} className="hover:underline">
                            r/{post.community.slug}
                          </Link>
                          <span className="mx-1">•</span>
                          <span>Posted by u/{post.author.username}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <Link href={`/r/${post.community.slug}/posts/${post.id}`}>
                          <h3 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            {post.title}
                          </h3>
                        </Link>

                        {post.content && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                            {post.content}
                          </p>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center mt-2 space-x-4">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {post._count.comments} Comments
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Share className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Bookmark className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-4">
              <Button variant="outline">Load More Posts</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 mx-20">
            {/* Home Info Card */}
            <Card className="w-72">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Home</CardTitle>
                <CardDescription>Your personal Reddit frontpage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/create-post">Create Post</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/create-community">Create Community</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Top Communities */}
            <Card className="w-72">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Top Communities
                </CardTitle>
                <CardDescription>Most active communities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCommunities.map((community, index) => (
                    <div key={community.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-gray-500 w-4">#{index + 1}</span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {community.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <Link href={`/r/${community.slug}`} className="text-sm font-medium hover:underline">
                            r/{community.slug}
                          </Link>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Users className="w-3 h-3 mr-1" />
                             members
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Communities */}
            {trendingCommunities.length > 0 && (
              <Card className="w-72">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Trending Communities
                  </CardTitle>
                  <CardDescription>New and growing communities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingCommunities.map((community) => (
                      <div key={community.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {community.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <Link href={`/r/${community.slug}`} className="text-sm font-medium hover:underline">
                              r/{community.slug}
                            </Link>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                               members
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">New</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reddit Premium Ad */}
            <Card className="w-72 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">R+</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Reddit Premium</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Ad-free browsing and more</p>
                  </div>
                </div>
                <Button className="w-full mt-3" variant="outline">
                  Try Now
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="w-72">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Post Karma</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Comment Karma</span>
                    <span className="font-medium">5,678</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cake Day</span>
                    <span className="font-medium">Jan 15, 2023</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}