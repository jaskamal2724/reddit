import FeedToggle from "@/components/feed-toggle"
import PostFeed from "@/components/post-feed"
import CommunityList from "@/components/community-list"

export default async function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
      <div className="md:col-span-2">
        <FeedToggle />
        <PostFeed />
      </div>
      <div className="hidden md:block">
        <div className="sticky top-20">
          <CommunityList />
        </div>
      </div>
    </div>
  )
}
